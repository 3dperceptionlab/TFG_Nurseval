package com.nursEval.backend.service;

import org.springframework.stereotype.Service;

import com.nursEval.backend.dtos.UpdateProfessorProfileRquest;
import com.nursEval.backend.exceptions.ResourceNotFoundException;
import com.nursEval.backend.model.Professor;
import com.nursEval.backend.repository.ProfessorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfessorService {
  private final ProfessorRepository professorRepository;
  
  public Professor getProfessorById(String id) {
    return professorRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Profesor no encontrado"));
  }

  public Professor getStudentByEmail(String email) {
    return professorRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Profesor no encontrado con el email indicado"));
  }

  public Professor updateProfile(String email, UpdateProfessorProfileRquest data) {
    Professor professor = professorRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Profesor no encontrado con el email indicado"));

    professor.setName(data.getName());
    professor.setSurname(data.getSurname());
    professor.setPosition(data.getPosition());

    return professorRepository.save(professor);
  }
}
