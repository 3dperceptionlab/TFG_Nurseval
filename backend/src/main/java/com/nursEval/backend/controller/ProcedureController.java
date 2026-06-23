package com.nursEval.backend.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nursEval.backend.dtos.FinalizeEvaluationRequest;
import com.nursEval.backend.dtos.ProcedureResponse;
import com.nursEval.backend.dtos.StudentResponse;
import com.nursEval.backend.dtos.auth.UserProfileResponse;
import com.nursEval.backend.model.Procedure;
import com.nursEval.backend.model.Professor;
import com.nursEval.backend.model.Student;
import com.nursEval.backend.model.embedded.Annotation;
import com.nursEval.backend.service.ProcedureService;
import com.nursEval.backend.service.ProfessorService;
import com.nursEval.backend.service.StudentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/procedures")
@RequiredArgsConstructor
public class ProcedureController {

  private final ProcedureService procedureService;
  private final StudentService studentService;
  private final ProfessorService professorService;

  private ProcedureResponse convertToProcedureResponse(Procedure procedure) {
    UserProfileResponse student = UserProfileResponse.builder()
      .id(procedure.getStudent().getId())
      .name(procedure.getStudent().getName())
      .surname(procedure.getStudent().getSurname())
      .email(procedure.getStudent().getEmail())
      .role(procedure.getStudent().getRole())
      .build();

    return ProcedureResponse.builder()
      .id(procedure.getId())
      .student(student)
      .protocolName(procedure.getProtocol().getTitle())
      .date(procedure.getDate())
      .state(procedure.getState())
      .globalMetrics(procedure.getGlobalMetrics())
      .build();
  }

  @GetMapping("/my-history")
  public ResponseEntity<List<ProcedureResponse>> getMyHistory(Principal principal, @RequestParam(required = false) String protocolName) { 
    String id = principal.getName();
    Student student = studentService.getStudentById(id);

    List<ProcedureResponse> history = procedureService.searchProcedures(student.getId(), null, null, protocolName).stream()
      .map(this::convertToProcedureResponse)
      .toList();

    return ResponseEntity.ok(history);
  }

  @GetMapping
  public ResponseEntity<List<ProcedureResponse>> getAll(
    @RequestParam(required = false) String state,
    @RequestParam(required = false) String protocolName) {
    
    List<ProcedureResponse> procedures = procedureService.searchProcedures(null, null, state, protocolName).stream()
      .map(this::convertToProcedureResponse)
      .toList();
      
    return ResponseEntity.ok(procedures);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Procedure> getById(@PathVariable String id) {
    return ResponseEntity.ok(procedureService.getProcedureById(id));
  }

  @GetMapping("/student/{studentId}")
  public ResponseEntity<List<ProcedureResponse>> getStudentHistory( @PathVariable String studentId, @RequestParam(required = false) String protocolName) {
      
    List<ProcedureResponse> history = procedureService.searchProcedures(studentId, null, null, protocolName).stream()
      .map(this::convertToProcedureResponse)
      .toList();

    return ResponseEntity.ok(history);
  }

  @GetMapping("/pending")
  public ResponseEntity<List<ProcedureResponse>> getPendingProcedures(Principal principal, @RequestParam(required = false) String protocolName) {
    String professorId = principal.getName();
    Professor professor = professorService.getProfessorById(professorId);
      
    List<ProcedureResponse> history = procedureService.searchProcedures(null, professor.getId(), "Pendiente", protocolName).stream()
      .map(this::convertToProcedureResponse)
      .toList();

    return ResponseEntity.ok(history);
  }

  // Añadir anotación (error, tip, etc.) a un procedimiento
  @PostMapping("/{procedureId}/annotations")
  public ResponseEntity<Annotation> addAnnotation(@PathVariable String procedureId, @Valid @RequestBody Annotation annotation) {
    Annotation savedAnnotation = procedureService.addAnnotation(procedureId, annotation);
    return ResponseEntity.ok(savedAnnotation);
  }

  // Editar anotación existente
  @PutMapping("/{procedureId}/annotations/{annotationId}")
  public ResponseEntity<Annotation> editAnnotation(@PathVariable String procedureId, @PathVariable String annotationId, @Valid @RequestBody Annotation annotationData) {

    Annotation updatedAnnotation = procedureService.editAnnotation(procedureId, annotationId, annotationData);
    return ResponseEntity.ok(updatedAnnotation);
  }

  // Eliminar anotación
  @DeleteMapping("/{procedureId}/annotations/{annotationId}")
  public ResponseEntity<Void> deleteAnnotation(
    @PathVariable String procedureId,
    @PathVariable String annotationId) {

    procedureService.deleteAnnotation(procedureId, annotationId);
    return ResponseEntity.noContent().build();
  }

  // Cerrar evaluación, poner nota y comentarios globales
  @PatchMapping("/{id}/finalize")
  public ResponseEntity<String> finalizeEvaluation(
    @PathVariable String id,
    @Valid @RequestBody FinalizeEvaluationRequest request) {

    procedureService.finalizeEvaluation(id, request);
    return ResponseEntity.status(HttpStatus.OK).body("success");
  }
}
