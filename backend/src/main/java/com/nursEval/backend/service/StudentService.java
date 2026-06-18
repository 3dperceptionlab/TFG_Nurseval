package com.nursEval.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.nursEval.backend.dtos.UpdateStudentProfileRequest;
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
    } else if (course != null || group != null) {
        students = studentRepository.findAll();
    } else {
        return List.of();
    }

    if (course != null) {
      students = students.stream().filter(s -> s.getCourse() == course).toList();
    }

    if (group != null) {
        students = students.stream().filter(s -> s.getGroup() == group).toList();
    }

    return students;
  }

  public Student getStudentById(String id) {
    return studentRepository.findById(id).orElseThrow(() -> new RuntimeException("Estudiante no encontrado con id: " + id));
  }

  public Student getStudentByEmail(String email) {
    return studentRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Estudiante no encontrado con email: " + email));
  }

  public Student getStudentByName(String name) {
    return studentRepository.findByName(name).orElseThrow(() -> new RuntimeException("Estudiante no encontrado con nombre: " + name));
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
        students = students.stream().filter(s -> s.getCourse() == course).toList();
    }
    if (group != null) {
        students = students.stream().filter(s -> s.getGroup() == group).toList();
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
    Student student = studentRepository.findById(studentId).orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

    if (student.getProfessor() != null && student.getProfessor().getId().equals(professorId)) {
      student.setProfessor(null); // limpiamos el campo
      studentRepository.save(student);
    } else {
      throw new RuntimeException("El estudiante no pertenece a este profesor o ya ha sido desvinculado");
    }
  }

  public Student updateProfile(String email, UpdateStudentProfileRequest data) {
    Student student = studentRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Profesor no encontrado"));

    student.setName(data.getName());
    student.setSurname(data.getSurname());
    student.setCourse(data.getCourse());
    student.setGroup(data.getGroup());

    return studentRepository.save(student);
  }
}
