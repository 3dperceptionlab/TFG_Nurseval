package com.nursEval.backend.controller;

import java.security.Principal;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nursEval.backend.dtos.auth.AuthTokens;
import com.nursEval.backend.dtos.auth.LoginRequest;
import com.nursEval.backend.dtos.auth.RegisterRequest;
import com.nursEval.backend.dtos.auth.UserProfileResponse;
import com.nursEval.backend.service.AuthService;
import com.nursEval.backend.service.CookieService;
import com.nursEval.backend.service.JwtService;
import com.nursEval.backend.service.RefreshTokenService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;
  private final CookieService cookieService;
  private final JwtService jwtService;
  private final RefreshTokenService refreshTokenService;

  private ResponseEntity<UserProfileResponse> withAuthCookies(AuthTokens tokens) {
    ResponseCookie accessCookie = cookieService.buildAccessTokenCookie(tokens.getAccessToken(), jwtService.getExpirationTime() / 1000);

    ResponseCookie refreshCookie = cookieService.buildRefreshTokenCookie(tokens.getRefreshToken(), refreshTokenService.getRefreshExpirationMs() / 1000);

    return ResponseEntity.ok()
      .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
      .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
      .body(tokens.getProfile());
  }

  @GetMapping("/me")
  public ResponseEntity<UserProfileResponse> getMyData(Principal principal) {
    String id = principal.getName(); 
    UserProfileResponse profile = authService.getData(id);
    return ResponseEntity.ok(profile);
  }

  @GetMapping("/check-email")
  public ResponseEntity<Boolean> checkEmail(@RequestParam String email) {
    boolean exists = authService.emailExists(email);
    return ResponseEntity.ok(exists);
  }

  @PostMapping("/register")
  public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
    authService.createUser(request);
    return ResponseEntity.status(HttpStatus.CREATED).build();
  }

  @PostMapping("/login")
  public ResponseEntity<UserProfileResponse> login(@Valid @RequestBody LoginRequest request) {
    AuthTokens tokens = authService.authenticate(request);
    return withAuthCookies(tokens);
  }

  @PostMapping("/refresh")
  public ResponseEntity<UserProfileResponse> refresh(
    @CookieValue(name = CookieService.REFRESH_TOKEN_COOKIE, required = false) String refreshToken
  ) {
    if (refreshToken == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    AuthTokens tokens = authService.refreshAccessToken(refreshToken);
    return withAuthCookies(tokens);
  }

  @PostMapping("/logout")
  public ResponseEntity<Void> logout(
    @CookieValue(name = CookieService.REFRESH_TOKEN_COOKIE, required = false) String refreshToken
  ) {
    authService.logout(refreshToken);

    ResponseCookie clearedAccess = cookieService.clearAccessTokenCookie();
    ResponseCookie clearedRefresh = cookieService.clearRefreshTokenCookie();

    return ResponseEntity.noContent()
      .header(HttpHeaders.SET_COOKIE, clearedAccess.toString())
      .header(HttpHeaders.SET_COOKIE, clearedRefresh.toString())
      .build();
  }

}