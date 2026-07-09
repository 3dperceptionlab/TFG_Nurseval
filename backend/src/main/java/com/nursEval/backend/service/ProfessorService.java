package com.nursEval.backend.service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.nursEval.backend.dtos.ProfessorStatsResponse;
import com.nursEval.backend.dtos.UpdateProfessorProfileRquest;
import com.nursEval.backend.exceptions.ResourceNotFoundException;
import com.nursEval.backend.model.Procedure;
import com.nursEval.backend.model.Professor;
import com.nursEval.backend.model.Student;
import com.nursEval.backend.repository.ProfessorRepository;
import com.nursEval.backend.repository.StudentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfessorService {
  private final ProfessorRepository professorRepository;
  private final PasswordEncoder passwordEncoder;
  private final StudentRepository studentRepository;
  private final ProcedureService procedureService;
  
  public Professor getProfessorById(String id) {
    return professorRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Profesor no encontrado"));
  }

  public Professor getStudentByEmail(String email) {
    return professorRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Profesor no encontrado con el email indicado"));
  }

  public Professor updateProfile(String id, UpdateProfessorProfileRquest data) {
    Professor professor = professorRepository.findById(id)
      .orElseThrow(() -> new ResourceNotFoundException("Profesor no encontrado"));

    if (data.getName() != null && !data.getName().isBlank()) 
      professor.setName(data.getName());
    if (data.getSurname() != null && !data.getSurname().isBlank()) 
      professor.setSurname(data.getSurname());
    if (data.getPosition() != null && !data.getPosition().isBlank()) 
      professor.setPosition(data.getPosition());

    if (data.getNewpassword() != null && !data.getNewpassword().isBlank()) {
      if (!passwordEncoder.matches(data.getCurrentpassword(), professor.getPassword())) {
        throw new IllegalArgumentException("La contraseña actual no es correcta");
      }
      if (!data.getNewpassword().equals(data.getRepassword())) {
        throw new IllegalArgumentException("Las contraseñas no coinciden");
      }
      professor.setPassword(passwordEncoder.encode(data.getNewpassword()));
    }

    return professorRepository.save(professor);
  }

  public ProfessorStatsResponse getStats(String professorId, String studentId) {
    List<Procedure> procedures;
    List<Student> students;

    if (studentId != null && !studentId.isBlank()) {
      Student student = studentRepository.findById(studentId).orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado"));

      if (student.getProfessor() == null || !professorId.equals(student.getProfessor().getId())) {
        throw new AccessDeniedException("No tienes acceso a las estadísticas de este alumno");
      }

      procedures = procedureService.searchProcedures(studentId, null, null, null);
      students = List.of(student); 
      
    } else {
      procedures = procedureService.searchProcedures(null, professorId, null, null);
      students = studentRepository.findByProfessor(professorId);
    }

    List<Procedure> evaluated = procedures.stream().filter(p -> "Evaluado".equals(p.getState()) && p.getGlobalMetrics() != null).toList();

    int total = procedures.size();
    int nEvaluated = evaluated.size();
    int pending = total - nEvaluated;

    double avgMark = evaluated.stream().mapToDouble(p -> p.getGlobalMetrics().getMark()).average().orElse(0);
    double avgImprov = evaluated.stream().mapToDouble(p -> p.getGlobalMetrics().getImprovementsCount()).average().orElse(0);
    double avgErrors = evaluated.stream().mapToDouble(p -> p.getGlobalMetrics().getErrorCount()).average().orElse(0);

    // Por protocolo
    Map<String, List<Procedure>> byProtocolMap = procedures.stream().filter(p -> p.getProtocol() != null).collect(Collectors.groupingBy(p -> p.getProtocol().getTitle()));

    List<ProfessorStatsResponse.ProtocolStats> byProtocol = byProtocolMap.entrySet().stream().map(entry -> {
      List<Procedure> group = entry.getValue();
      List<Procedure> eval = group.stream().filter(p -> "Evaluado".equals(p.getState()) && p.getGlobalMetrics() != null).toList();

      double avg = eval.stream().mapToDouble(p -> p.getGlobalMetrics().getMark()).average().orElse(0);
      double improv = eval.stream().mapToDouble(p -> p.getGlobalMetrics().getImprovementsCount()).average().orElse(0);
      double errors = eval.stream().mapToDouble(p -> p.getGlobalMetrics().getErrorCount()).average().orElse(0);
      int passed = (int) eval.stream().filter(p -> p.getGlobalMetrics().getMark() >= 5).count();
      
      return ProfessorStatsResponse.ProtocolStats.builder()
        .protocolName(entry.getKey())
        .total(group.size())
        .passed(passed)
        .failed(eval.size() - passed)
        .avgMark(Math.round(avg * 10.0) / 10.0)
        .avgAttention(Math.round(improv * 10.0) / 10.0)
        .avgErrors(Math.round(errors * 10.0) / 10.0)
        .build();
    }).toList();

    // Por mes
    Map<String, List<Procedure>> byMonthMap = procedures.stream().filter(p -> p.getDate() != null)
    .collect(Collectors.groupingBy(p -> p.getDate().getYear() + "-" + p.getDate().getMonthValue()));

    List<ProfessorStatsResponse.MonthStats> byMonth = byMonthMap.entrySet().stream().map(entry -> {
      String[] parts = entry.getKey().split("-");
      List<Procedure> group = entry.getValue();
      List<Procedure> eval = group.stream().filter(p -> "Evaluado".equals(p.getState()) && p.getGlobalMetrics() != null).toList();
      double avg = eval.stream().mapToDouble(p -> p.getGlobalMetrics().getMark()).average().orElse(0);

      Map<String, Integer> totalByProtocol = group.stream()
        .filter(p -> p.getProtocol() != null)
        .collect(Collectors.groupingBy(p -> p.getProtocol().getTitle(), Collectors.collectingAndThen(Collectors.counting(), Long::intValue)));

      Map<String, Double> avgMarkByProtocol = eval.stream()
        .filter(p -> p.getProtocol() != null)
        .collect(Collectors.groupingBy(p -> p.getProtocol().getTitle(), Collectors.averagingDouble(p -> p.getGlobalMetrics().getMark())));

      return ProfessorStatsResponse.MonthStats.builder()
        .year(Integer.parseInt(parts[0]))
        .month(Integer.parseInt(parts[1]))
        .total(group.size())
        .evaluated(eval.size())
        .pending(group.size() - eval.size())
        .avgMark(Math.round(avg * 10.0) / 10.0)
        .totalByProtocol(totalByProtocol)
        .avgMarkByProtocol(avgMarkByProtocol)
        .build();
    })
    .sorted(Comparator.comparingInt(ProfessorStatsResponse.MonthStats::getYear)
    .thenComparingInt(ProfessorStatsResponse.MonthStats::getMonth))
    .toList();

    // Ranking de alumnos
    List<ProfessorStatsResponse.StudentRanking> ranking = students.stream().map(student -> {
      List<Procedure> studentProcs = procedures.stream()
        .filter(p -> p.getStudent() != null && student.getId().equals(p.getStudent().getId()))
        .toList();
      List<Procedure> studentEval = studentProcs.stream().filter(p -> "Evaluado".equals(p.getState()) && p.getGlobalMetrics() != null).toList();
      double studentAvg = studentEval.stream().mapToDouble(p -> p.getGlobalMetrics().getMark()).average().orElse(0);

      // mejor y peor protocolo
      Map<String, Double> avgByProtocol = studentEval.stream()
        .filter(p -> p.getProtocol() != null)
        .collect(Collectors.groupingBy(p -> p.getProtocol().getTitle(), Collectors.averagingDouble(p -> p.getGlobalMetrics().getMark())));

      String best = avgByProtocol.entrySet().stream().max(Map.Entry.comparingByValue()).map(Map.Entry::getKey).orElse("-");
      String worst = avgByProtocol.entrySet().stream().min(Map.Entry.comparingByValue()).map(Map.Entry::getKey).orElse("-");

      return ProfessorStatsResponse.StudentRanking.builder()
        .studentId(student.getId())
        .studentName(student.getName() + " " + student.getSurname())
        .totalProcedures(studentProcs.size())
        .evaluated(studentEval.size())
        .pending(studentProcs.size() - studentEval.size())
        .avgMark(Math.round(studentAvg * 10.0) / 10.0)
        .bestProtocol(best)
        .worstProtocol(worst)
        .build();
    })
    .sorted(Comparator.comparingDouble(ProfessorStatsResponse.StudentRanking::getAvgMark).reversed()).toList();

    return ProfessorStatsResponse.builder()
      .totalStudents(students.size())
      .totalProcedures(total)
      .evaluatedProcedures(nEvaluated)
      .pendingProcedures(pending)
      .avgMark(Math.round(avgMark * 10.0) / 10.0)
      .avgAttention(Math.round(avgImprov * 10.0) / 10.0)
      .avgErrors(Math.round(avgErrors * 10.0) / 10.0)
      .byProtocol(byProtocol)
      .byMonth(byMonth)
      .studentRanking(ranking)
      .build();
  }
}