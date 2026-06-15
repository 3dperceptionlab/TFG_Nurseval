package com.nursEval.backend.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document("professors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Professor {
 
  @Id
  private String id;

  private String name;
  private String surname;
  private String role;
  private String email;
  private String password;
  private LocalDateTime lastLogin;
  private String position;
  private boolean active;
}
