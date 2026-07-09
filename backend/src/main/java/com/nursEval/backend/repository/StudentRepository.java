package com.nursEval.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.nursEval.backend.model.Student;

public interface StudentRepository extends MongoRepository<Student, String>{
  Optional<Student> findByEmail(String email);

  Optional<Student> findByName(String name);

  @Query("{ 'professor': ObjectId(?0) }")
  List<Student> findByProfessor(String professorId);

  Boolean existsByEmail(String email);

  @Query("{ '$or': [ " +
  "{ 'name': { '$regex': ?0, '$options': 'i' } }, " +
  "{ 'surname': { '$regex': ?0, '$options': 'i' } }, " +
  "{ 'email': { '$regex': ?0, '$options': 'i' } } " + "] }")
  List<Student> searchAllByField(String query);

  @Query("{ 'professor': ObjectId(?0), '$or': [ " +
  "{ 'name': { '$regex': ?1, '$options': 'i' } }, " +
  "{ 'surname': { '$regex': ?1, '$options': 'i' } }, " +
  "{ 'email': { '$regex': ?1, '$options': 'i' } } " + "] }")
  List<Student> searchWithinProfessorByField(String professorId, String query);
}
