package com.nursEval.backend.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nursEval.backend.dtos.StudentResponse;
import com.nursEval.backend.dtos.UpdateStudentProfileRequest;
import com.nursEval.backend.model.Student;
import com.nursEval.backend.service.StudentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {
  
  private final StudentService studentService;

  private StudentResponse convertToStudentResponse(Student student) {
    String profName = (student.getProfessor() != null)  ? student.getProfessor().getName() + " " + student.getProfessor().getSurname() : "Sin profesor asignado"; 

    return StudentResponse.builder()
      .id(student.getId())
      .name(student.getName())
      .surname(student.getSurname())
      .email(student.getEmail())
      .course(student.getCourse())
      .group(student.getGroup())
      .professorName(profName) 
      .build();
  }


  @GetMapping("/me")
  public ResponseEntity<StudentResponse> getMyProfile(Principal principal) {
    String email = principal.getName(); // Extrae el email del token
    return ResponseEntity.ok(convertToStudentResponse(studentService.getStudentByEmail(email)));
  }

  @PutMapping("/me")
  public ResponseEntity<Void> updateMyProfile(
    Principal principal, 
    @Valid @RequestBody UpdateStudentProfileRequest request) {
      
    String email = principal.getName(); //  desde el JWT
    studentService.updateProfile(email, request);
    return ResponseEntity.noContent().build();
  }

  @GetMapping
  public ResponseEntity<List<StudentResponse>> getGlobalStudents(
    @RequestParam(required = false) String query,
    @RequestParam(required = false) Integer course, 
    @RequestParam(required = false) Integer group) 
  {
    List<StudentResponse> filteredStudents = studentService.getAllStudents(query, course, group).stream()
      .map(this::convertToStudentResponse)
      .toList();

    return ResponseEntity.ok(filteredStudents);
  }

  // Obtener los alumnos asociados a un profesor específico
  @GetMapping("/professor/{professorId}")
  public ResponseEntity<List<StudentResponse>> getMyStudents(
    @PathVariable String professorId, 
    @RequestParam(required = false) String query,
    @RequestParam(required = false) Integer course,  
    @RequestParam(required = false) Integer group) { 

    List<StudentResponse> filteredStudents = studentService.getStudentsFromProfessor(professorId, query, course, group).stream()
      .map(this::convertToStudentResponse)
      .toList();

    return ResponseEntity.ok(filteredStudents);
  }

  // Desvincular a un estudiante de un profesor
  @DeleteMapping("/{studentId}/professor/{professorId}")
  public ResponseEntity<Void> removeStudentFromProfessor( @PathVariable String studentId, @PathVariable String professorId) {
    studentService.removeStudentFromProfessor(studentId, professorId);
    return ResponseEntity.noContent().build(); 
  }
}
