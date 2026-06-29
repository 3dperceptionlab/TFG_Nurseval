package com.nursEval.backend.dtos;

import lombok.Data;

@Data
public class UpdateStudentProfileRequest {
  private String name;
  private String surname;

  private String course;

  private String group;

  private String currentpassword;
  private String newpassword;
  private String repassword;
}
