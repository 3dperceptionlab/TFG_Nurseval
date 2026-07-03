package com.nursEval.backend.dtos.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AuthTokens {
  private String accessToken;
  private String refreshToken;
  private UserProfileResponse profile;
}