package com.nursEval.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.nursEval.backend.dtos.UpdateStudentProfileRequest;
import com.nursEval.backend.exceptions.ResourceNotFoundException;
import com.nursEval.backend.model.Student;
import com.nursEval.backend.repository.StudentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentService {
  private final StudentRepository studentRepository;

  public List<Student> getAllStudents(String query, Integer course, Integer group) {
    List<Student> students;

    if (query != null && !query.trim().isEmpty()) {
      students = studentRepository.searchAllByField(query.trim());
    } else {
      students = studentRepository.findAll();
    }

    if (course != null) {
      students = students.stream().filter(s -> course.equals(s.getCourse())).toList();
    }

    if (group != null) {
      students = students.stream().filter(s -> group.equals(s.getGroup())).toList();
    }

    return students;
  }

  public Student getStudentById(String id) {
    return studentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado"));
  }

  public Student getStudentByEmail(String email) {
    return studentRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado con el email indicado"));
  }

  public Student getStudentByName(String name) {
    return studentRepository.findByName(name).orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado"));
  }

  public List<Student> getStudentsFromProfessor(String professorId, String query, Integer course, Integer group) {
    List<Student> students = studentRepository.findByProfessor(professorId);

    if (query != null && !query.trim().isEmpty()) {
        String lowerQuery = query.toLowerCase().trim();
        students = students.stream()
        .filter(s -> (s.getName() != null && s.getName().toLowerCase().contains(lowerQuery)) ||
                      (s.getSurname() != null && s.getSurname().toLowerCase().contains(lowerQuery)) ||
                      (s.getEmail() != null && s.getEmail().toLowerCase().contains(lowerQuery)))
        .toList();
    }
    
    if (course != null) {
        students = students.stream().filter(s -> course.equals(s.getCourse())).toList();
    }
    if (group != null) {
        students = students.stream().filter(s -> group.equals(s.getGroup())).toList();
    }

    return students;
  }

  public List<Student> searchStudentsGlobal(String query) {
    return studentRepository.searchAllByField(query);
  }

  public List<Student> searchMyStudents(String professorId, String query) {
    return studentRepository.searchWithinProfessorByField(professorId, query);
  }

  public void removeStudentFromProfessor(String studentId, String professorId) {
    Student student = getStudentById(studentId); 

    if (student.getProfessor() != null && student.getProfessor().getId().equals(professorId)) {
      student.setProfessor(null); 
      studentRepository.save(student);
    } else {
      throw new IllegalArgumentException("El estudiante no pertenece a este profesor o ya ha sido desvinculado.");
    }
  }

  public Student updateProfile(String email, UpdateStudentProfileRequest data) {
    Student student = getStudentByEmail(email); 

    if (data.getName() != null && !data.getName().trim().isEmpty()) student.setName(data.getName());
    if (data.getSurname() != null && !data.getSurname().trim().isEmpty()) student.setSurname(data.getSurname());
    if (data.getCourse() != null) student.setCourse(data.getCourse());
    if (data.getGroup() != null) student.setGroup(data.getGroup());

    return studentRepository.save(student);
  }
}