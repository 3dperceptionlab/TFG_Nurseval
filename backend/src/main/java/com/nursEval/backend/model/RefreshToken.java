package com.nursEval.backend.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Refresh token persistido en MongoDB.
 * IMPORTANTE: nunca guardamos el token en claro, solo su hash (SHA-256).
 */
@Document(collection = "refresh_tokens")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshToken {

  @Id
  private String id;

  @Indexed(unique = true)
  private String tokenHash;

  @Indexed
  private String userId;

  private String role;

  private LocalDateTime expiryDate;

  private boolean revoked;

  private LocalDateTime createdAt;
}