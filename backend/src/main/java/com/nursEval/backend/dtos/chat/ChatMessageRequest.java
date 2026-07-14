package com.nursEval.backend.dtos.chat;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageRequest {
  @NotBlank(message = "El identificador de sesión no puede estar vacío")
  private String sessionId;

  @NotBlank(message = "El mensaje no puede estar vacío")
  private String message;
}
