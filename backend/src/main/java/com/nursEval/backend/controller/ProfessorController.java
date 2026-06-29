package com.nursEval.backend.controller;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nursEval.backend.dtos.ProfessorStatsResponse;
import com.nursEval.backend.dtos.UpdateProfessorProfileRquest;
import com.nursEval.backend.model.Professor;
import com.nursEval.backend.service.ProfessorService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/professors")
@RequiredArgsConstructor
public class ProfessorController {
  private final ProfessorService professorService;

  @GetMapping("/profile")
  public ResponseEntity<Professor> getMyProfile(Principal principal) {
    String id = principal.getName();
    return ResponseEntity.ok(professorService.getProfessorById(id));
  }

  @PutMapping("/profile")
  public ResponseEntity<Professor> updateMyProfile(
    Principal principal, 
    @Valid @RequestBody UpdateProfessorProfileRquest request) {
      
    String id = principal.getName(); //  desde el JWT
    Professor updated = professorService.updateProfile(id, request);
    return ResponseEntity.ok(updated);
  }

  @GetMapping("/my-stats")
  @PreAuthorize("hasRole('PROFESSOR')")
  public ResponseEntity<ProfessorStatsResponse> getProfessorStats(
    Principal principal,
    @RequestParam(required = false) String studentId) {

    Professor professor = professorService.getProfessorById(principal.getName());
    return ResponseEntity.ok(professorService.getStats(professor.getId(), studentId));
  }

}
