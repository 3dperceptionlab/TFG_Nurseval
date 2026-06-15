package com.nursEval.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.nursEval.backend.model.Protocol;

public interface ProtocolRepository extends MongoRepository<Protocol, String>{

}
