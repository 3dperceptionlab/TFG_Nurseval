package com.nursEval.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.nursEval.backend.model.Student;

public interface StudentRepository extends MongoRepository<Student, String>{
  Optional<Student> findByEmail(String email);

  List<Student> findByProfessor(String professorId);
}
