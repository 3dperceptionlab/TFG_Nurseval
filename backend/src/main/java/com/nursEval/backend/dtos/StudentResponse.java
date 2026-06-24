package com.nursEval.backend.dtos;

import java.time.LocalDateTime;

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
  private String course;
  private String group;
  private String professorName;
  private LocalDateTime lastLogin;
  private Double avgMark;
  private Integer nPractices;
}
