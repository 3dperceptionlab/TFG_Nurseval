package com.nursEval.backend.controller;

import java.security.Principal;
import java.util.List;

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

import com.nursEval.backend.model.Procedure;
import com.nursEval.backend.model.Student;
import com.nursEval.backend.model.embedded.Annotation;
import com.nursEval.backend.service.ProcedureService;
import com.nursEval.backend.service.StudentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/procedures")
@RequiredArgsConstructor
public class ProcedureController {

  private final ProcedureService procedureService;
  private final StudentService studentService;

  @GetMapping("/my-history")
  public ResponseEntity<List<Procedure>> getMyHistory(Principal principal, @RequestParam(required = false) String protocolName) { 
    String email = principal.getName();
    Student student = studentService.getStudentByEmail(email);

    List<Procedure> history = procedureService.searchProcedures(student.getId(), null, null, protocolName);
    
    return ResponseEntity.ok(history);
  }

  @GetMapping
  public ResponseEntity<List<Procedure>> getAll(
    @RequestParam(required = false) String state,
    @RequestParam(required = false) String protocolName) {
    
    List<Procedure> procedures = procedureService.searchProcedures(null, null, state, protocolName);
    return ResponseEntity.ok(procedures);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Procedure> getById(@PathVariable String id) {
    return ResponseEntity.ok(procedureService.getProcedureById(id));
  }

  @GetMapping("/student/{studentId}")
  public ResponseEntity<List<Procedure>> getStudentHistory(
      @PathVariable String studentId,
      @RequestParam(required = false) String protocolName) {
      
    List<Procedure> history = procedureService.searchProcedures(studentId, null, null, protocolName);
    return ResponseEntity.ok(history);
  }

  @GetMapping("/professor/{professorId}")
  public ResponseEntity<List<Procedure>> getPendingProcedures(
      @PathVariable String professorId,
      @RequestParam(required = false) String state,
      @RequestParam(required = false) String protocolName) {
      
    List<Procedure> history = procedureService.searchProcedures(null, professorId, "pending", protocolName);
    return ResponseEntity.ok(history);
  }

  // Añadir anotación (error, tip, etc.) a un procedimiento
  @PostMapping("/{procedureId}/annotations")
  public ResponseEntity<Annotation> addAnnotation(
    @PathVariable String procedureId, 
    @Valid @RequestBody Annotation annotation) {

    Annotation savedAnnotation = procedureService.addAnnotation(procedureId, annotation);
    return ResponseEntity.ok(savedAnnotation);
  }

  // Editar anotación existente
  @PutMapping("/{procedureId}/annotations/{annotationId}")
  public ResponseEntity<Annotation> editAnnotation(
    @PathVariable String procedureId,
    @PathVariable String annotationId,
    @Valid @RequestBody Annotation annotationData) {

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
  public ResponseEntity<Procedure> finalizeEvaluation(
    @PathVariable String id,
    @RequestParam Double mark,
    @RequestParam(required = false) String comment) {

    Procedure finalizedProcedure = procedureService.finalizeEvaluation(id, mark, comment);
    return ResponseEntity.ok(finalizedProcedure);
  }
}
