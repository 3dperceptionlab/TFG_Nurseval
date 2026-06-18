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

  @GetMapping("/me")
  public ResponseEntity<Student> getMyProfile(Principal principal) {
      String email = principal.getName(); // Extrae el email del token
      return ResponseEntity.ok(studentService.getStudentByEmail(email));
  }

  @PutMapping("/me")
  public ResponseEntity<Student> updateMyProfile(
    Principal principal, 
    @Valid @RequestBody UpdateStudentProfileRequest request) {
      
    String email = principal.getName(); //  desde el JWT
    Student updated = studentService.updateProfile(email, request);
    return ResponseEntity.ok(updated);
  }

  @GetMapping
  public ResponseEntity<List<Student>> getGlobalStudents(
      @RequestParam(required = false) String query,
      @RequestParam(required = false) Integer course, 
      @RequestParam(required = false) Integer group) 
  {
      List<Student> result = studentService.getAllStudents(query, course, group);
      return ResponseEntity.ok(result);
  }

  // Obtener los alumnos asociados a un profesor específico
  @GetMapping("/professor/{professorId}")
  public ResponseEntity<List<Student>> getMyStudents(
    @PathVariable String professorId, 
    @RequestParam(required = false) String query,
    @RequestParam(required = false) Integer course,  
    @RequestParam(required = false) Integer group) { 

    List<Student> filteredStudents = studentService.getStudentsFromProfessor(professorId, query, course, group);
    return ResponseEntity.ok(filteredStudents);
  }

  // Desvincular a un estudiante de un profesor
  @DeleteMapping("/{studentId}/professor/{professorId}")
  public ResponseEntity<Void> removeStudentFromProfessor( @PathVariable String studentId, @PathVariable String professorId) {
    studentService.removeStudentFromProfessor(studentId, professorId);
    return ResponseEntity.noContent().build(); 
  }
}
