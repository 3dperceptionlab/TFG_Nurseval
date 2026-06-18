package com.nursEval.backend.service;

import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.nursEval.backend.dtos.auth.LoginRequest;
import com.nursEval.backend.dtos.auth.LoginResponse;
import com.nursEval.backend.dtos.auth.RegisterRequest;
import com.nursEval.backend.model.Professor;
import com.nursEval.backend.model.Student;
import com.nursEval.backend.repository.ProfessorRepository;
import com.nursEval.backend.repository.StudentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final StudentRepository studentRepository;
  private final ProfessorRepository professorRepository;
  private final BCryptPasswordEncoder passwordEncoder;
  private final JwtService jwtService;


  public LoginResponse authenticate(LoginRequest request) {
    // buscar en ambas colecciones
    Optional<Professor> prof = professorRepository.findByEmail(request.getEmail());
    if (prof.isPresent() && passwordEncoder.matches(request.getPassword(), prof.get().getPassword())) {
        String token = jwtService.generateToken(prof.get().getEmail(), "professor");
        return new LoginResponse(token, "Bearer", "professor", prof.get().getEmail(), token);
    }

    Optional<Student> stu = studentRepository.findByEmail(request.getEmail());
    if (stu.isPresent() && passwordEncoder.matches(request.getPassword(), stu.get().getPassword())) {
        String token = jwtService.generateToken(stu.get().getEmail(), "student");
        return new LoginResponse(token, "Bearer", "student", stu.get().getEmail(), token);
    }

    throw new RuntimeException("Credenciales inválidas");
  }

  public void createUser(RegisterRequest request) {
    // el email existe en alguna tabla?
    if (studentRepository.existsByEmail(request.getEmail()) || 
      professorRepository.existsByEmail(request.getEmail())) {
      throw new RuntimeException("El email ya está registrado");
    }

    String encodedPassword = passwordEncoder.encode(request.getPassword());

    if ("professor".equalsIgnoreCase(request.getRole())) {
      Professor p = new Professor();
      p.setName(request.getName());
      p.setSurname(request.getSurname());
      p.setEmail(request.getEmail());
      p.setPassword(encodedPassword);
      p.setPosition(request.getPosition());
      professorRepository.save(p);
    } else {
      Student s = new Student();
      s.setName(request.getName());
      s.setSurname(request.getSurname());
      s.setEmail(request.getEmail());
      s.setPassword(encodedPassword);
      s.setGroup(request.getStudent_group());
      s.setCourse(request.getStudent_course());
      studentRepository.save(s);
    }
  }
}
