package com.nursEval.backend.model.embedded;

import org.springframework.data.annotation.Id;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Annotation {
  @Id
  private String id;

  @NotNull(message = "El minuto/segundo es obligatorio")
  private double minute; // en segundos

  @NotBlank(message = "El título de la anotación no puede estar vacío")
  private String title;

  @NotBlank(message = "La descripción no puede estar vacía")
  private String description;

  @NotBlank(message = "El tipo es obligatorio")
  private String type;

  private String tip;
}
