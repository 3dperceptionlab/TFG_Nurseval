package com.nursEval.backend.controller;

import com.nursEval.backend.repository.ProfessorRepository;
import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
import com.nursEval.backend.model.Professor;
import com.nursEval.backend.model.Student;
import com.nursEval.backend.service.ProcedureService;
import com.nursEval.backend.service.ProfessorService;
import com.nursEval.backend.service.StudentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {
  
  private final ProfessorService professorService;
  private final StudentService studentService;
  private final ProcedureService procedureService;

  private StudentResponse convertToStudentResponse(Student student) {
    String profName = (student.getProfessor() != null)  ? student.getProfessor().getName() + " " + student.getProfessor().getSurname() : "Sin profesor asignado"; 
    int nPractices = procedureService.countByStudentId(student.getId());

    return StudentResponse.builder()
      .id(student.getId())
      .name(student.getName())
      .surname(student.getSurname())
      .email(student.getEmail())
      .course(student.getCourse())
      .group(student.getGroup())
      .professorName(profName) 
      .lastLogin(student.getLastLogin())
      .nPractices(nPractices)
      .avgMark(student.getAvgMark())
      .build();
  }


  @GetMapping("/profile")
  public ResponseEntity<StudentResponse> getMyProfile(Principal principal) {
    String email = principal.getName(); // Extrae el email del token
    return ResponseEntity.ok(convertToStudentResponse(studentService.getStudentByEmail(email)));
  }

  @PutMapping("/profile")
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
    @RequestParam(required = false) String course, 
    @RequestParam(required = false) String group) 
  {
    List<StudentResponse> filteredStudents = studentService.getAllStudents(query, course, group).stream()
      .map(this::convertToStudentResponse)
      .toList();

    return ResponseEntity.ok(filteredStudents);
  }

  @GetMapping("/{studentId}")
  @PreAuthorize("hasRole('PROFESSOR')")
  public ResponseEntity<StudentResponse> getStudentById(@PathVariable String studentId) {
    Student student = studentService.getStudentById(studentId);
    return ResponseEntity.ok(convertToStudentResponse(student));
  }

  // Obtener los alumnos asociados a un profesor específico
  @GetMapping("/my-students")
  public ResponseEntity<List<StudentResponse>> getMyStudents(
    Principal principal, 
    @RequestParam(required = false) String query,
    @RequestParam(required = false) String course,  
    @RequestParam(required = false) String group) { 
    
    String professorId = principal.getName();
    Professor professor = professorService.getProfessorById(professorId);

    List<StudentResponse> filteredStudents = studentService.getStudentsFromProfessor(professor.getId(), query, course, group).stream()
      .map(this::convertToStudentResponse)
      .toList();

    return ResponseEntity.ok(filteredStudents);
  }

  @PutMapping("/{studentId}/professor")
  public ResponseEntity<Void> assignProfessor(
    @PathVariable String studentId,
    Principal principal) {
    String professorId = principal.getName();
    Professor professor = professorService.getProfessorById(professorId);

    studentService.assignProfessorToStudent(studentId, professor.getId());
    return ResponseEntity.noContent().build();
  }

  // Desvincular a un estudiante de un profesor
  @DeleteMapping("/{studentId}/professor")
  public ResponseEntity<Void> removeStudentFromProfessor(Principal principal, @PathVariable String studentId) {
    String professorId = principal.getName();
    Professor professor = professorService.getProfessorById(professorId);

    studentService.removeStudentFromProfessor(studentId, professor.getId());
    return ResponseEntity.noContent().build(); 
  }
}
