package com.nursEval.backend.model.embedded;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Annotation {
  private double minute; // en segundos
  private String title;
  private String description;
  private String type;
  private String tip;
}
