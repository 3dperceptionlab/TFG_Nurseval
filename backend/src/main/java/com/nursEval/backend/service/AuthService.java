package com.nursEval.backend.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.nursEval.backend.dtos.auth.AuthTokens;
import com.nursEval.backend.dtos.auth.LoginRequest;
import com.nursEval.backend.dtos.auth.RegisterRequest;
import com.nursEval.backend.dtos.auth.UserProfileResponse;
import com.nursEval.backend.exceptions.AccountInactiveException;
import com.nursEval.backend.exceptions.EmailAlreadyExistsException;
import com.nursEval.backend.exceptions.InvalidCredentialsException;
import com.nursEval.backend.exceptions.PasswordsDoNotMatchException;
import com.nursEval.backend.exceptions.ResourceNotFoundException;
import com.nursEval.backend.model.Professor;
import com.nursEval.backend.model.RefreshToken;
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
  private final RefreshTokenService refreshTokenService;

  private AuthTokens buildAuthTokens(String id, String name, String surname, String email, String role) {
    String accessToken = jwtService.generateToken(id, name, role);
    var issued = refreshTokenService.issue(id, role);

    UserProfileResponse profile = new UserProfileResponse(id, name, surname, email, role);

    return AuthTokens.builder()
      .accessToken(accessToken)
      .refreshToken(issued.rawToken())
      .profile(profile)
      .build();
  }
  
  public UserProfileResponse getData(String id) {
    Optional<Student> stu = studentRepository.findById(id);

    if(stu.isPresent()){
      return new UserProfileResponse( stu.get().getId(), stu.get().getName(), stu.get().getSurname(), stu.get().getEmail(), stu.get().getRole());
    }

    Optional<Professor> pro = professorRepository.findById(id);

    if(pro.isPresent()){
      return new UserProfileResponse( pro.get().getId(), pro.get().getName(), pro.get().getSurname(), pro.get().getEmail(), pro.get().getRole());
    }

    throw new ResourceNotFoundException("Usuario no encontrado.");
  }

  public AuthTokens authenticate(LoginRequest request) {
    // buscar en ambas colecciones
    Optional<Professor> prof = professorRepository.findByEmail(request.getEmail());
    if (prof.isPresent() && passwordEncoder.matches(request.getPassword(), prof.get().getPassword())) {
      Professor professor = prof.get(); 

      if(!professor.isActive())
        throw new AccountInactiveException();
      
      professor.setLastLogin(LocalDateTime.now());
      professorRepository.save(professor);

      return buildAuthTokens(professor.getId(), professor.getName(), professor.getSurname(),
        professor.getEmail(), "professor");
    }

    Optional<Student> stu = studentRepository.findByEmail(request.getEmail());
    if (stu.isPresent() && passwordEncoder.matches(request.getPassword(), stu.get().getPassword())) {
      Student student = stu.get(); 

      if(!student.isActive())
        throw new AccountInactiveException();

      student.setLastLogin(LocalDateTime.now());
      studentRepository.save(student);

      return buildAuthTokens(student.getId(), student.getName(), student.getSurname(),
        student.getEmail(), "student");
    }

    throw new InvalidCredentialsException("Credenciales inválidas.");
  }


  // Valida el refresh token (rotándolo) y emite un nuevo par de tokens para el mismo usuario.
  public AuthTokens refreshAccessToken(String rawRefreshToken) {
    RefreshToken stored = refreshTokenService.validateAndConsume(rawRefreshToken);
    UserProfileResponse profile = getData(stored.getUserId());

    String accessToken = jwtService.generateToken(profile.getId(), profile.getName(), stored.getRole());
    var issued = refreshTokenService.issue(stored.getUserId(), stored.getRole());

    return AuthTokens.builder()
      .accessToken(accessToken)
      .refreshToken(issued.rawToken())
      .profile(profile)
      .build();
  }

  public void logout(String rawRefreshToken) {
    if (rawRefreshToken != null) {
      refreshTokenService.revokeByRawToken(rawRefreshToken);
    }
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
      p.setRole("professor");
      professorRepository.save(p);
    } else {
      Student s = new Student();
      s.setName(request.getName());
      s.setSurname(request.getSurname());
      s.setEmail(request.getEmail());
      s.setPassword(encodedPassword);
      s.setRole("student");
      s.setActive(true);

      if (request.getStudent_group() != null) 
        s.setGroup(request.getStudent_group());

      if (request.getStudent_course() != null) 
        s.setCourse(request.getStudent_course());
      
      studentRepository.save(s);
    }
  }

  public boolean emailExists(String email) {
    return studentRepository.existsByEmail(email) || professorRepository.existsByEmail(email);
  }
}