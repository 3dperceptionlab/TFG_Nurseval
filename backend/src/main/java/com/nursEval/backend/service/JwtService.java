package com.nursEval.backend.service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;

@Service
public class JwtService {

  @Value("${security.jwt.secret}")
  private String secretKey;

  @Value("${security.jwt.expiration}")
  private long jwtExpiration;

  public String generateToken(String id, String name, String role) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("role", role);
    claims.put("name", name); 
    
    return buildToken(claims, id, jwtExpiration);
  }

  public String extractUserId(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  public String extractRole(String token) {
    return extractClaim(token, claims -> claims.get("role", String.class));
  }

  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  public long getExpirationTime() {
    return jwtExpiration;
  }

  public boolean isTokenValid(String token) {
    try {
        return !isTokenExpired(token);
    } catch (ExpiredJwtException e) {
        return false;
    } catch (JwtException | IllegalArgumentException e) {
        // firma inválida, token malformado, etc.
        return false;
    }
  }

  private boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
  }

  private Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
  }

  private Claims extractAllClaims(String token) {
    return Jwts
      .parserBuilder()
      .setSigningKey(getSignInKey())
      .build()
      .parseClaimsJws(token)
      .getBody();
  }

  private String buildToken(Map<String, Object> extraClaims, String subject, long expiration) {
    return Jwts
      .builder()
      .setClaims(extraClaims)
      .setSubject(subject)
      .setIssuedAt(new Date(System.currentTimeMillis()))
      .setExpiration(new Date(System.currentTimeMillis() + expiration))
      .signWith(getSignInKey(), SignatureAlgorithm.HS256)
      .compact();
  }

  private Key getSignInKey() {
    byte[] keyBytes = Decoders.BASE64.decode(secretKey);
    return Keys.hmacShaKeyFor(keyBytes);
  }
}
