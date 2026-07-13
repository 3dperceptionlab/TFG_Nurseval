package com.nursEval.backend.controller;

import com.nursEval.backend.model.Protocol;
import com.nursEval.backend.model.embedded.Step;
import com.nursEval.backend.repository.ProtocolRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/chatbot")
public class DialogflowWebhookController {

  private final ProtocolRepository protocolRepository;

  DialogflowWebhookController(ProtocolRepository protocolRepository) {
      this.protocolRepository = protocolRepository;
  }

  @PostMapping("/webhook")
  public Map<String, Object> handleDialogflowRequest(@RequestBody Map<String, Object> request) {

    Map<String, Object> queryResult = (Map<String, Object>) request.get("queryResult");
    Map<String, Object> parameters = (Map<String, Object>) queryResult.get("parameters");
    String intentName = (String) ((Map<String, Object>) queryResult.get("intent")).get("displayName");

    // intents sin db
    switch (intentName) {
      case "Saludo":
        return buildSimpleTextResponse("¡Hola! Soy tu asistente de enfermería. ¿En qué puedo ayudarte?");

      case "despedida":
        return buildSimpleTextResponse("¡De nada! Espero haberte ayudado. Vuelve cuando quieras si necesitas repasar algo más. 💪");

      case "listar_tipos_vendaje":
        return buildListResponse();
    }

    // intents con db
    String tipoVendaje = (String) parameters.get("tipo");

    if (tipoVendaje == null || tipoVendaje.isEmpty()) {
        return buildSimpleTextResponse("¿De qué tipo de vendaje necesitas información?");
    }

    List<Protocol> protocolos = protocolRepository.findByTitleContainingIgnoreCase(tipoVendaje);

    if (protocolos.isEmpty()) {
        return buildSimpleTextResponse("Lo siento, no tengo información registrada sobre el vendaje: " + tipoVendaje);
    }

    Protocol p = protocolos.get(0);

    //elegir respuesta
    switch (intentName) {
      case "materiales_vendaje":
        return buildMaterialsResponse(p);

      case "explicar_tipo_vendaje":
        return buildGeneralResponse(p);

      default:
      // Si el intent no es ninguno de los anteriores pero encontró un protocolo
      return buildGeneralResponse(p);
    }
  }

  // listar chips
  private Map<String, Object> buildListResponse() {
    List<Map<String, String>> options = List.of(
      Map.of("text", "Capelina"),
      Map.of("text", "Tobillo en espiga"),
      Map.of("text", "Muñeca y antebrazo en espiga")
    );

    List<Map<String, Object>> richContent = List.of(
      Map.of(
        "type", "info",
        "title", "Vendajes disponibles",
        "subtitle", "Selecciona uno para ver el procedimiento:"
      ),
      Map.of(
        "type", "chips",
        "options", options
      )
    );
    return buildFinalPayload(richContent);
  }

  private Map<String, Object> buildGeneralResponse(Protocol p) {
    List<Map<String, Object>> richContent = new ArrayList<>();

    // imagen principal
    if (p.getImage() != null) {
      richContent.add(Map.of("type", "image", "rawUrl", p.getImage()));
    }

    // titulo y proposito
    richContent.add(Map.of(
      "type", "info",
      "title", p.getTitle(),
      "subtitle", p.getPurpose()
    ));

    // recorrer lista de pasos
    for (int i = 0; i < p.getSteps().size(); i++) {
      Step step = p.getSteps().get(i);
      Map<String, Object> stepBlock = new HashMap<>();
      stepBlock.put("type", "description");
      stepBlock.put("title", "Paso " + (i + 1) + ": " + step.getTitle());

      List<String> textLines = new ArrayList<>();
      textLines.add(step.getDescription());
      if (step.getTip() != null && !step.getTip().isEmpty()) {
        textLines.add("");
        textLines.add("💡 CONSEJO: " + step.getTip());
      }
      stepBlock.put("text", textLines);
      richContent.add(stepBlock);

      if (step.getImage() != null && !step.getImage().isEmpty()) {
        richContent.add(Map.of("type", "image", "rawUrl", step.getImage()));
      }
      richContent.add(Map.of("type", "divider"));
    }

    // chips de navegación
    richContent.add(Map.of(
        "type", "chips",
        "options", List.of(
          Map.of("text", "Materiales: " + p.getTitle()),
          Map.of("text", "Ver otros vendajes")
        )
    ));

    return buildFinalPayload(richContent);
  }

  private Map<String, Object> buildMaterialsResponse(Protocol p) {
    List<Map<String, Object>> richContent = new ArrayList<>();
    Map<String, Object> materialBlock = new HashMap<>();
    materialBlock.put("type", "description");
    materialBlock.put("title", "Materiales para: " + p.getTitle());

    List<String> lineasMateriales = new ArrayList<>();
    for (String material : p.getMaterials()) {
      lineasMateriales.add("- " + material);
    }
    materialBlock.put("text", lineasMateriales);
    richContent.add(materialBlock);

    richContent.add(Map.of(
      "type", "chips",
      "options", List.of(
        Map.of("text", "Cómo se hace: " + p.getTitle())
      )
    ));

    return buildFinalPayload(richContent);
  }

  // Helpers de formato
  private Map<String, Object> buildFinalPayload(List<Map<String, Object>> content) {
    return Map.of("fulfillmentMessages", List.of(Map.of("payload", Map.of("richContent", List.of(content)))));
  }

  private Map<String, Object> buildSimpleTextResponse(String text) {
    return Map.of("fulfillmentMessages", List.of(Map.of("text", Map.of("text", List.of(text)))));
  }
}