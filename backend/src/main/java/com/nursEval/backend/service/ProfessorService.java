package com.nursEval.backend.service;

import org.springframework.stereotype.Service;

import com.nursEval.backend.dtos.UpdateProfessorProfileRquest;
import com.nursEval.backend.model.Professor;
import com.nursEval.backend.repository.ProfessorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfessorService {
  private final ProfessorRepository professorRepository;
  
  public Professor getProfessorById(String id) {
    return professorRepository.findById(id).orElseThrow(() -> new RuntimeException("Profesor no encontrado con id: " + id));
  }

  public Professor getStudentByEmail(String email) {
    return professorRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Profesor no encontrado con email: " + email));
  }

  public Professor updateProfile(String email, UpdateProfessorProfileRquest data) {
    Professor professor = professorRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Profesor no encontrado"));

    professor.setName(data.getName());
    professor.setSurname(data.getSurname());
    professor.setPosition(data.getPosition());

    return professorRepository.save(professor);
  }
}
