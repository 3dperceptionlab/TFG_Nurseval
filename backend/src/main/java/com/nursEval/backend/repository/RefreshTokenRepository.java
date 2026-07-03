package com.nursEval.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.nursEval.backend.model.RefreshToken;

public interface RefreshTokenRepository extends MongoRepository<RefreshToken, String> {

  Optional<RefreshToken> findByTokenHash(String tokenHash);

  List<RefreshToken> findAllByUserIdAndRevokedFalse(String userId);

  void deleteByUserId(String userId);
}