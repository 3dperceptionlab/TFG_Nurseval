package com.nursEval.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
public class CookieService {

  public static final String ACCESS_TOKEN_COOKIE = "accessToken";
  public static final String REFRESH_TOKEN_COOKIE = "refreshToken";

  // En local false, en produccion true.
  @Value("${security.cookie.secure:false}")
  private boolean secure;

  // "Lax" funciona si frontend y backend comparten el dominio raíz o por proxy. Sino "NOne"
  @Value("${security.cookie.same-site:Lax}")
  private String sameSite;

  public ResponseCookie buildAccessTokenCookie(String token, long maxAgeSeconds) {
    return ResponseCookie.from(ACCESS_TOKEN_COOKIE, token)
      .httpOnly(true)
      .secure(secure)
      .sameSite(sameSite)
      .path("/")
      .maxAge(maxAgeSeconds)
      .build();
  }

  public ResponseCookie buildRefreshTokenCookie(String token, long maxAgeSeconds) {
    return ResponseCookie.from(REFRESH_TOKEN_COOKIE, token)
      .httpOnly(true)
      .secure(secure)
      .sameSite(sameSite)
      .path("/api/auth") // Solo a endponts de auth 
      .maxAge(maxAgeSeconds)
      .build();
  }

  public ResponseCookie clearAccessTokenCookie() {
    return ResponseCookie.from(ACCESS_TOKEN_COOKIE, "")
      .httpOnly(true).secure(secure).sameSite(sameSite).path("/").maxAge(0).build();
  }

  public ResponseCookie clearRefreshTokenCookie() {
    return ResponseCookie.from(REFRESH_TOKEN_COOKIE, "")
      .httpOnly(true).secure(secure).sameSite(sameSite).path("/api/auth").maxAge(0).build();
  }
}