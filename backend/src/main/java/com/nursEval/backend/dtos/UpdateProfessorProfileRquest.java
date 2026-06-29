package com.nursEval.backend.dtos;

import lombok.Data;

@Data
public class UpdateProfessorProfileRquest {
  private String name;
  private String surname;
  private String position;

  private String currentpassword;
  private String newpassword;
  private String repassword;
}
