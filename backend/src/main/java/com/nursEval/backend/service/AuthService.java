package com.nursEval.backend.service;

import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.nursEval.backend.dtos.auth.LoginRequest;
import com.nursEval.backend.dtos.auth.LoginResponse;
import com.nursEval.backend.dtos.auth.RegisterRequest;
import com.nursEval.backend.exceptions.AccountInactiveException;
import com.nursEval.backend.exceptions.EmailAlreadyExistsException;
import com.nursEval.backend.exceptions.InvalidCredentialsException;
import com.nursEval.backend.exceptions.PasswordsDoNotMatchException;
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
      
      if(!prof.get().isActive())
        throw new AccountInactiveException();

      String token = jwtService.generateToken(prof.get().getId(), prof.get().getName(), "professor");
      return new LoginResponse(token, "professor", prof.get().getName());
    }

    Optional<Student> stu = studentRepository.findByEmail(request.getEmail());
    if (stu.isPresent() && passwordEncoder.matches(request.getPassword(), stu.get().getPassword())) {

      if(!stu.get().isActive())
        throw new AccountInactiveException();

      String token = jwtService.generateToken(stu.get().getId(), stu.get().getName(), "student");
      return new LoginResponse(token, "student", stu.get().getName());
    }

    throw new InvalidCredentialsException("Credenciales inválidas.");
  }

  public void createUser(RegisterRequest request) {
    if (request.getPassword() == null || !request.getPassword().equals(request.getRepassword())) {
      throw new PasswordsDoNotMatchException("Las contraseñas introducidas no coinciden.");
    }

    // el email existe en alguna tabla?
    if (studentRepository.existsByEmail(request.getEmail()) || 
      professorRepository.existsByEmail(request.getEmail())) {
      throw new EmailAlreadyExistsException("El email ya está registrado");
    }

    String encodedPassword = passwordEncoder.encode(request.getPassword());

    if ("professor".equalsIgnoreCase(request.getRole())) {
      Professor p = new Professor();
      p.setName(request.getName());
      p.setSurname(request.getSurname());
      p.setEmail(request.getEmail());
      p.setPassword(encodedPassword);
      p.setPosition(request.getPosition());
      p.setActive(true);
      professorRepository.save(p);
    } else {
      Student s = new Student();
      s.setName(request.getName());
      s.setSurname(request.getSurname());
      s.setEmail(request.getEmail());
      s.setPassword(encodedPassword);
      s.setActive(true);

      if (request.getStudent_group() != null) 
        s.setGroup(request.getStudent_group());

      if (request.getStudent_course() != null) 
        s.setCourse(request.getStudent_course());
      
      studentRepository.save(s);
    }
  }
}
