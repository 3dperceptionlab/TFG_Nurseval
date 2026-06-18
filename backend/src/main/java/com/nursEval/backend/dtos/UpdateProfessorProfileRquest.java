package com.nursEval.backend.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateProfessorProfileRquest {
  @NotBlank(message = "El nombre no puede estar vacío")
  private String name;

  @NotBlank(message = "El apellido no puede estar vacío")
  private String surname;

  @NotBlank(message = "El cargo es obligatorio")
  private String position;
}
