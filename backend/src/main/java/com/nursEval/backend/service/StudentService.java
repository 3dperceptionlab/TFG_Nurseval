package com.nursEval.backend.service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.nursEval.backend.dtos.StudentStatsResponse;
import com.nursEval.backend.dtos.UpdateStudentProfileRequest;
import com.nursEval.backend.exceptions.ResourceNotFoundException;
import com.nursEval.backend.model.Procedure;
import com.nursEval.backend.model.Professor;
import com.nursEval.backend.model.Student;
import com.nursEval.backend.repository.StudentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentService {
  private final StudentRepository studentRepository;
  private final ProfessorService professorService;
  private final PasswordEncoder passwordEncoder;
  private final ProcedureService procedureService;


  public List<Student> getAllStudents(String query, String course, String group) {
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

  public List<Student> getStudentsFromProfessor(String professorId, String query, String course, String group) {
    List<Student> students;
    
    if (query != null && !query.trim().isEmpty()) {
        students = studentRepository.searchWithinProfessorByField(professorId, query.trim());
    } else {
        // Si no hay texto, traemos todos los del profesor
        students = studentRepository.findByProfessor(professorId);
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
    if (query == null || query.trim().isEmpty()) {
        return studentRepository.findByProfessor(professorId); 
    }
    
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

  public Student updateProfile(String id, UpdateStudentProfileRequest data) {
    Student student = getStudentById(id);

    if (data.getName() != null && !data.getName().isBlank()) student.setName(data.getName());
    if (data.getSurname() != null && !data.getSurname().isBlank()) student.setSurname(data.getSurname());
    if (data.getCourse() != null) student.setCourse(data.getCourse());
    if (data.getGroup() != null) student.setGroup(data.getGroup());

    if (data.getNewpassword() != null && !data.getNewpassword().isBlank()) {
      if (!passwordEncoder.matches(data.getCurrentpassword(), student.getPassword())) {
        throw new IllegalArgumentException("La contraseña actual no es correcta");
      }
      if (!data.getNewpassword().equals(data.getRepassword())) {
        throw new IllegalArgumentException("Las contraseñas no coinciden");
      }
      student.setPassword(passwordEncoder.encode(data.getNewpassword()));
    }

    return studentRepository.save(student);
  }

  public void assignProfessorToStudent(String studentId, String professorId) {
    Student student = getStudentById(studentId);
    Professor professor = professorService.getProfessorById(professorId);
    
    student.setProfessor(professor);

    studentRepository.save(student);
  }

  public StudentStatsResponse getStats(String studentId) {
    List<Procedure> procedures = procedureService.searchProcedures(studentId, null, null, null);

    int total = procedures.size();
    int evaluated = (int) procedures.stream().filter(p -> "Evaluado".equals(p.getState())).count();
    int pending = total - evaluated;

    List<Procedure> withMetrics = procedures.stream()
      .filter(p -> p.getGlobalMetrics() != null && "Evaluado".equals(p.getState())).toList();

    double avgMark = withMetrics.stream().mapToDouble(p -> p.getGlobalMetrics().getMark()).average().orElse(0);
    double avgAttention = withMetrics.stream().mapToDouble(p -> p.getGlobalMetrics().getAttentionPercent()).average().orElse(0);
    double avgErrors = withMetrics.stream().mapToDouble(p -> p.getGlobalMetrics().getErrorCount()).average().orElse(0);

    // Por protocolo
    Map<String, List<Procedure>> byProtocol = procedures.stream()
      .filter(p -> p.getProtocol() != null)
      .collect(Collectors.groupingBy(p -> p.getProtocol().getTitle()));

    List<StudentStatsResponse.ProtocolStats> protocolStats = byProtocol.entrySet().stream().map(entry -> {
      List<Procedure> group = entry.getValue();
      List<Procedure> eval = group.stream().filter(p -> p.getGlobalMetrics() != null && "Evaluado".equals(p.getState())).toList();
      double avg = eval.stream().mapToDouble(p -> p.getGlobalMetrics().getMark()).average().orElse(0);
      int passed = (int) eval.stream().filter(p -> p.getGlobalMetrics().getMark() >= 5).count();
      return StudentStatsResponse.ProtocolStats.builder()
        .protocolName(entry.getKey())
        .total(group.size())
        .passed(passed)
        .failed(eval.size() - passed)
        .avgMark(Math.round(avg * 10.0) / 10.0)
        .build();
    }).toList();

    // Por mes
    Map<String, List<Procedure>> byMonth = procedures.stream()
      .filter(p -> p.getDate() != null)
      .collect(Collectors.groupingBy(p -> p.getDate().getYear() + "-" + p.getDate().getMonthValue()));

    List<StudentStatsResponse.MonthStats> monthStats = byMonth.entrySet().stream().map(entry -> {
      String[] parts = entry.getKey().split("-");
      List<Procedure> group = entry.getValue();
      List<Procedure> eval = group.stream()
        .filter(p -> p.getGlobalMetrics() != null && "Evaluado".equals(p.getState()))
        .toList();
      double avg = eval.stream().mapToDouble(p -> p.getGlobalMetrics().getMark()).average().orElse(0);

      // desglose por protocolo
      Map<String, Integer> totalByProtocol = group.stream()
        .filter(p -> p.getProtocol() != null)
        .collect(Collectors.groupingBy(p -> p.getProtocol().getTitle(),Collectors.collectingAndThen(Collectors.counting(), Long::intValue)));

      Map<String, Double> avgMarkByProtocol = eval.stream()
        .filter(p -> p.getProtocol() != null && p.getGlobalMetrics() != null)
        .collect(Collectors.groupingBy(p -> p.getProtocol().getTitle(), Collectors.averagingDouble(p -> p.getGlobalMetrics().getMark())));

      return StudentStatsResponse.MonthStats.builder()
        .year(Integer.parseInt(parts[0]))
        .month(Integer.parseInt(parts[1]))
        .total(group.size())
        .avgMark(Math.round(avg * 10.0) / 10.0)
        .totalByProtocol(totalByProtocol)
        .avgMarkByProtocol(avgMarkByProtocol)
        .build();
    })
    .sorted(Comparator.comparingInt(StudentStatsResponse.MonthStats::getYear)
    .thenComparingInt(StudentStatsResponse.MonthStats::getMonth))
    .toList();

    return StudentStatsResponse.builder()
      .totalProcedures(total)
      .evaluatedProcedures(evaluated)
      .pendingProcedures(pending)
      .avgMark(Math.round(avgMark * 10.0) / 10.0)
      .avgAttention(Math.round(avgAttention * 10.0) / 10.0)
      .avgErrors(Math.round(avgErrors * 10.0) / 10.0)
      .byProtocol(protocolStats)
      .byMonth(monthStats)
      .build();
  }
}