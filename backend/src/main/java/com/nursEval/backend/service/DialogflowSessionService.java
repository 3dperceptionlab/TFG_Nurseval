package com.nursEval.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.gax.rpc.ApiException;
import com.google.cloud.dialogflow.v2.DetectIntentRequest;
import com.google.cloud.dialogflow.v2.DetectIntentResponse;
import com.google.cloud.dialogflow.v2.Intent.Message;
import com.google.cloud.dialogflow.v2.QueryInput;
import com.google.cloud.dialogflow.v2.QueryResult;
import com.google.cloud.dialogflow.v2.SessionName;
import com.google.cloud.dialogflow.v2.SessionsClient;
import com.google.cloud.dialogflow.v2.TextInput;
import com.google.protobuf.Struct;
import com.google.protobuf.util.JsonFormat;
import com.nursEval.backend.dtos.chat.ChatMessageResponse;
import com.nursEval.backend.exceptions.DialogflowIntegrationException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class DialogflowSessionService {

  private final SessionsClient sessionsClient;
  private final ObjectMapper objectMapper = new ObjectMapper();

  @Value("${dialogflow.project-id}")
  private String projectId;

  @Value("${dialogflow.language-code}")
  private String languageCode;

  public ChatMessageResponse sendMessage(String sessionId, String message) {
    SessionName session = SessionName.of(projectId, sessionId);

    TextInput textInput = TextInput.newBuilder()
      .setText(message)
      .setLanguageCode(languageCode)
      .build();

    QueryInput queryInput = QueryInput.newBuilder()
      .setText(textInput)
      .build();

    DetectIntentRequest request = DetectIntentRequest.newBuilder()
      .setSession(session.toString())
      .setQueryInput(queryInput)
      .build();

    try {
      DetectIntentResponse response = sessionsClient.detectIntent(request);
      return mapToChatResponse(response.getQueryResult());
    } catch (ApiException ex) {
      log.error("Error llamando a Dialogflow detectIntent", ex);
      throw new DialogflowIntegrationException("No se pudo procesar el mensaje del chatbot.", ex);
    }
  }

  private ChatMessageResponse mapToChatResponse(QueryResult queryResult) {
    List<Object> richContent = extractRichContent(queryResult);

    return ChatMessageResponse.builder()
      .text(queryResult.getFulfillmentText())
      .richContent(richContent)
      .build();
  }

  @SuppressWarnings("unchecked")
  private List<Object> extractRichContent(QueryResult queryResult) {
    List<Object> richContent = new ArrayList<>();

    for (Message fulfillmentMessage : queryResult.getFulfillmentMessagesList()) {
      Struct payload = fulfillmentMessage.getPayload();
      if (payload.getFieldsMap().isEmpty()) {
        continue;
      }

      try {
        String json = JsonFormat.printer().print(payload);
        var payloadMap = objectMapper.readValue(json, java.util.Map.class);
        Object content = payloadMap.get("richContent");
        // richContent tiene forma [[bloque1, bloque2, ...]] (filas de bloques); aplanamos a nivel de bloque
        if (content instanceof List<?> rows) {
          for (Object row : rows) {
            if (row instanceof List<?> blocks) {
              richContent.addAll((List<Object>) blocks);
            }
          }
        }
      } catch (Exception ex) {
        log.error("Error parseando el payload de Dialogflow", ex);
      }
    }

    return richContent;
  }
}
