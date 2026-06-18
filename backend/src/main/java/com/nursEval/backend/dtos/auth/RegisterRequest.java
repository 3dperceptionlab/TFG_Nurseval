package com.nursEval.backend.dtos.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

  @NotBlank(message = "El email no puede estar vacío")
  @Email(message = "El formato del email no es válido")
  private String email;

  @NotBlank(message = "La contraseña no puede estar vacía")
  @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
  private String password;

  @NotBlank(message = "La contraseña no puede estar vacía")
  private String repassword;

  @NotBlank(message = "El nombre no puede estar vacío")
  private String name;
  
  @NotBlank(message = "El apellido no puede estar vacío")
  private String surname;

  @NotBlank(message = "El rol no puede estar vacío")
  @Pattern(regexp = "^(?i)(professor|student)$", message = "El rol debe ser 'professor' o 'student'")
  private String role;
  
  private String position;      // profesores
  private Integer student_group; // estudiantes
  private Integer student_course; // estudiantes
}
