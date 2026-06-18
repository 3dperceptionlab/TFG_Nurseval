package com.nursEval.backend.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FinalizeEvaluationRequest {
  @NotNull(message = "La nota numérica es obligatoria para finalizar.")
  @Min(value = 0, message = "La nota mínima es 0.")
  @Max(value = 10, message = "La nota máxima es 10.")
  private Double mark;

  private String comment;
}
