package com.nursEval.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.nursEval.backend.model.Hololens;

public interface HololensRepository extends MongoRepository<Hololens, String> {

}
