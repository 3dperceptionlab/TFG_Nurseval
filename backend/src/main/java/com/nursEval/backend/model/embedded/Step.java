package com.nursEval.backend.model.embedded;

import org.springframework.data.annotation.Id;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Step {
  @Id
  private String id;

  private String title;
  private String description;
  private String tip;
  private String image;
}
