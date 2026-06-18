package com.nursEval.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.nursEval.backend.model.Procedure;

public interface ProcedureRepository extends MongoRepository<Procedure, String>{
  List<Procedure> findByStudent(String studentId);
 
  List<Procedure> findByProtocol(String protocolName) ;
 
  List<Procedure> findByState(String state);
}
