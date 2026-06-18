package com.nursEval.backend.controller;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

  @GetMapping("/me")
  public ResponseEntity<Professor> getMyProfile(Principal principal) {
    String email = principal.getName(); // Extrae el email del token
    return ResponseEntity.ok(professorService.getProfessorById(email));
  }

  @PutMapping("/me")
  public ResponseEntity<Professor> updateMyProfile(
    Principal principal, 
    @Valid @RequestBody UpdateProfessorProfileRquest request) {
      
    String email = principal.getName(); //  desde el JWT
    Professor updated = professorService.updateProfile(email, request);
    return ResponseEntity.ok(updated);
  }

}
