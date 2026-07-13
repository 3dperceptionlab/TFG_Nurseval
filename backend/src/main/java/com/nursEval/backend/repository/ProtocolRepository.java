package com.nursEval.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.nursEval.backend.model.Protocol;

public interface ProtocolRepository extends MongoRepository<Protocol, String>{
   Optional<Protocol> findByTitleIgnoreCase(String title);
   List<Protocol> findByTitleContainingIgnoreCase(String title);
}
