package com.nursEval.backend.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.nursEval.backend.model.Professor;

public interface ProfessorRepository extends MongoRepository<Professor, String>{
  Optional<Professor> findByEmail(String email);
}
