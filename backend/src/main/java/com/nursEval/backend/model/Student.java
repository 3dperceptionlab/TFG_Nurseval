package com.nursEval.backend.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document("students")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {
 
  @Id
  private String id;

  private String name;
  private String surname;
  private String role;
  private String email;
  private String password;
  private double avgMark;
  private LocalDateTime lastLogin;
  private String course;
  private String group;
  private boolean active;
  @DocumentReference
  private Professor professor; // referencia al id de Professor
}
