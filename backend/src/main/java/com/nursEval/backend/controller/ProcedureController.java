package com.nursEval.backend.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
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
import com.nursEval.backend.dtos.SummaryProcedureResponse;
import com.nursEval.backend.dtos.StudentResponse;
import com.nursEval.backend.dtos.StudentStatsResponse;
import com.nursEval.backend.dtos.auth.UserProfileResponse;
import com.nursEval.backend.model.Procedure;
import com.nursEval.backend.model.Professor;
import com.nursEval.backend.model.Student;
import com.nursEval.backend.model.embedded.Annotation;
import com.nursEval.backend.model.embedded.GlobalMetrics;
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

  private SummaryProcedureResponse convertToSummaryProcedureResponse(Procedure procedure) {
    UserProfileResponse studentRes = null;
    if (procedure.getStudent() != null) {
      studentRes = UserProfileResponse.builder()
      .id(procedure.getStudent().getId())
      .name(procedure.getStudent().getName())
      .surname(procedure.getStudent().getSurname())
      .email(procedure.getStudent().getEmail())
      .role(procedure.getStudent().getRole())
      .build();
    }

     String protocolName = (procedure.getProtocol() != null) ? procedure.getProtocol().getTitle() : "No especificado";

    if (procedure.getGlobalMetrics() == null) {
        procedure.setGlobalMetrics(new GlobalMetrics());
    }
    return SummaryProcedureResponse.builder()
    .id(procedure.getId())
    .student(studentRes)
    .protocolName(protocolName)
    .date(procedure.getDate())
    .state(procedure.getState())
    .globalMetrics(procedure.getGlobalMetrics())
    .build();
  }

  @GetMapping
  @PreAuthorize("hasRole('PROFESSOR')")
  public ResponseEntity<List<SummaryProcedureResponse>> getAll(
    @RequestParam(required = false) String state,
    @RequestParam(required = false) String protocolName) {
    
    List<SummaryProcedureResponse> procedures = procedureService.searchProcedures(null, null, state, protocolName).stream()
      .map(this::convertToSummaryProcedureResponse)
      .toList();
      
    return ResponseEntity.ok(procedures);
  }

  @GetMapping("/{id}")
  public ResponseEntity<ProcedureResponse> getById(@PathVariable String id, Principal principal) {
    ProcedureResponse response = procedureService.getProcedureById(id);

    String callerId = principal.getName();
    boolean isOwnerStudent = callerId.equals(response.getStudentId());
    boolean isOwnerProfessor = false;

    if (!isOwnerStudent) {
      try {
        studentService.getStudentByIdForProfessor(response.getStudentId(), callerId);
        isOwnerProfessor = true;
      } catch (AccessDeniedException e) {
        isOwnerProfessor = false;
      }
    }

    if (!isOwnerStudent && !isOwnerProfessor) {
      throw new AccessDeniedException("No tienes acceso a este procedimiento");
    }

    return ResponseEntity.ok(response);
  }

  @GetMapping("/my-history")
  @PreAuthorize("hasRole('STUDENT')")  
  public ResponseEntity<List<SummaryProcedureResponse>> getMyHistory(Principal principal) {
    String studentId = principal.getName();
    Student student = studentService.getStudentById(studentId);

    List<SummaryProcedureResponse> history = procedureService
      .searchProcedures(student.getId(), null, null, null).stream()
      .map(this::convertToSummaryProcedureResponse)
      .toList();

    return ResponseEntity.ok(history);
  }

  @GetMapping("/student/{studentId}")
  @PreAuthorize("hasRole('PROFESSOR')")
  public ResponseEntity<List<SummaryProcedureResponse>> getStudentHistory(
    Principal principal, @PathVariable String studentId, @RequestParam(required = false) String protocolName) {

    Student student = studentService.getStudentByIdForProfessor(studentId, principal.getName());
    List<SummaryProcedureResponse> history = procedureService
      .searchProcedures(student.getId(), null, null, protocolName).stream()
      .map(this::convertToSummaryProcedureResponse)
      .toList();

    return ResponseEntity.ok(history);
  }

  @GetMapping("/pending")
  @PreAuthorize("hasRole('PROFESSOR')") 
  public ResponseEntity<List<SummaryProcedureResponse>> getPendingProcedures(Principal principal, @RequestParam(required = false) String protocolName) {
    String professorId = principal.getName();
    Professor professor = professorService.getProfessorById(professorId);
      
    List<SummaryProcedureResponse> history = procedureService.searchProcedures(null, professor.getId(), "Pendiente", protocolName).stream()
      .map(this::convertToSummaryProcedureResponse)
      .toList();

    return ResponseEntity.ok(history);
  }

  // Añadir anotación (error, tip, etc.) a un procedimiento
  @PostMapping("/{procedureId}/annotations")
  @PreAuthorize("hasRole('PROFESSOR')")
  public ResponseEntity<Annotation> addAnnotation(@PathVariable String procedureId, @Valid @RequestBody Annotation annotation) {
    Annotation savedAnnotation = procedureService.addAnnotation(procedureId, annotation);
    return ResponseEntity.ok(savedAnnotation);
  }

  // Editar anotación existente
  @PutMapping("/{procedureId}/annotations/{annotationId}")
  @PreAuthorize("hasRole('PROFESSOR')")
  public ResponseEntity<Annotation> editAnnotation(@PathVariable String procedureId, @PathVariable String annotationId, @Valid @RequestBody Annotation annotationData) {

    Annotation updatedAnnotation = procedureService.editAnnotation(procedureId, annotationId, annotationData);
    return ResponseEntity.ok(updatedAnnotation);
  }

  // Eliminar anotación
  @DeleteMapping("/{procedureId}/annotations/{annotationId}")
  @PreAuthorize("hasRole('PROFESSOR')")
  public ResponseEntity<Void> deleteAnnotation(
    @PathVariable String procedureId,
    @PathVariable String annotationId) {

    procedureService.deleteAnnotation(procedureId, annotationId);
    return ResponseEntity.noContent().build();
  }

  // Cerrar evaluación, poner nota y comentarios globales
  @PatchMapping("/{id}/finalize")
  @PreAuthorize("hasRole('PROFESSOR')")
  public ResponseEntity<String> finalizeEvaluation(
    @PathVariable String id,
    @Valid @RequestBody FinalizeEvaluationRequest request) {

    procedureService.finalizeEvaluation(id, request);
    return ResponseEntity.noContent().build();
  }
}