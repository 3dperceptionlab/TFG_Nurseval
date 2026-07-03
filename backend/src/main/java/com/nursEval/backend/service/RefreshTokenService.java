package com.nursEval.backend.service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.nursEval.backend.exceptions.InvalidRefreshTokenException;
import com.nursEval.backend.model.RefreshToken;
import com.nursEval.backend.repository.RefreshTokenRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

  private final RefreshTokenRepository refreshTokenRepository;
  private final SecureRandom secureRandom = new SecureRandom();

  @Value("${security.jwt.refresh-expiration}")
  private long refreshExpirationMs;

  // Resultado interno: el valor en claro (para la cookie) nunca se persiste
  public record IssuedRefreshToken(String rawToken, LocalDateTime expiryDate) {}

  public IssuedRefreshToken issue(String userId, String role) {
    String rawToken = generateRawToken();
    LocalDateTime expiry = LocalDateTime.now().plusSeconds(refreshExpirationMs / 1000);

    RefreshToken entity = RefreshToken.builder()
      .id(UUID.randomUUID().toString())
      .tokenHash(hash(rawToken))
      .userId(userId)
      .role(role)
      .expiryDate(expiry)
      .revoked(false)
      .createdAt(LocalDateTime.now())
      .build();

    refreshTokenRepository.save(entity);
    return new IssuedRefreshToken(rawToken, expiry);
  }

  /**
   * Valida el refresh token recibido y, si es válido, lo revoca y emite uno nuevo (rotación).
   * Si el token ya estaba revocado, se interpreta como posible robo/reuso y se revocan
   * todos los refresh tokens activos del usuario, forzando un nuevo login.
   */
  public RefreshToken validateAndConsume(String rawToken) {
    String hashed = hash(rawToken);
    RefreshToken stored = refreshTokenRepository.findByTokenHash(hashed)
      .orElseThrow(() -> new InvalidRefreshTokenException("Refresh token no reconocido."));

    if (stored.isRevoked()) {
      revokeAllForUser(stored.getUserId());
      throw new InvalidRefreshTokenException("Refresh token reutilizado. Se han revocado todas las sesiones.");
    }

    if (stored.getExpiryDate().isBefore(LocalDateTime.now())) {
      throw new InvalidRefreshTokenException("Refresh token expirado.");
    }

    stored.setRevoked(true);
    refreshTokenRepository.save(stored);

    return stored;
  }

  public void revokeByRawToken(String rawToken) {
    Optional<RefreshToken> stored = refreshTokenRepository.findByTokenHash(hash(rawToken));
    stored.ifPresent(t -> {
      t.setRevoked(true);
      refreshTokenRepository.save(t);
    });
  }

  public void revokeAllForUser(String userId) {
    List<RefreshToken> tokens = refreshTokenRepository.findAllByUserIdAndRevokedFalse(userId);
    tokens.forEach(t -> t.setRevoked(true));
    refreshTokenRepository.saveAll(tokens);
  }

  public long getRefreshExpirationMs() {
    return refreshExpirationMs;
  }

  private String generateRawToken() {
    byte[] bytes = new byte[64];
    secureRandom.nextBytes(bytes);
    return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
  }

  private String hash(String value) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      byte[] hashed = digest.digest(value.getBytes());
      return Base64.getUrlEncoder().withoutPadding().encodeToString(hashed);
    } catch (NoSuchAlgorithmException e) {
      throw new IllegalStateException("SHA-256 no disponible", e);
    }
  }
}