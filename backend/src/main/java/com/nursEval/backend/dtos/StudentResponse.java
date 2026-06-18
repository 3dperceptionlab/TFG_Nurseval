package com.nursEval.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentResponse {
  private String id;
  private String name;
  private String surname;
  private String email;
  private Integer course;
  private Integer group;
  private String professorName;
}
