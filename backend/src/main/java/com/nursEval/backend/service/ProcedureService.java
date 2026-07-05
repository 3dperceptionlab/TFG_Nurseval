package com.nursEval.backend.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.naming.NameNotFoundException;

import org.bson.types.ObjectId;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.nursEval.backend.dtos.FinalizeEvaluationRequest;
import com.nursEval.backend.dtos.ProcedureResponse;
import com.nursEval.backend.dtos.StudentStatsResponse;
import com.nursEval.backend.exceptions.ResourceNotFoundException;
import com.nursEval.backend.model.Procedure;
import com.nursEval.backend.model.Student;
import com.nursEval.backend.model.embedded.Annotation;
import com.nursEval.backend.model.embedded.GlobalMetrics;
import com.nursEval.backend.repository.ProcedureRepository;
import com.nursEval.backend.repository.StudentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProcedureService {

  private final ProcedureRepository procedureRepository;
  private final StudentRepository studentRepository;
  private final MongoTemplate mongoTemplate;

  private ObjectId toObjectId(String id) {
    if (!ObjectId.isValid(id)) {
      throw new IllegalArgumentException("El identificador '" + id + "' no es válido.");
    }
    return new ObjectId(id);
  }

  private void updateErrorCount(Procedure procedure) {
    if (procedure.getAnnotations() == null) return;

     long totalErrors = procedure.getAnnotations().stream()
      .filter(a -> a.getType() != null && a.getType().equalsIgnoreCase("error"))
      .count();

    if (procedure.getGlobalMetrics() == null) {
      procedure.setGlobalMetrics(new GlobalMetrics());
    }
    procedure.getGlobalMetrics().setErrorCount((int) totalErrors);

  }

  private void updateImprovCount(Procedure procedure) {
    if (procedure.getAnnotations() == null) return;

     long totalImprov = procedure.getAnnotations().stream()
      .filter(a -> a.getType() != null && a.getType().equalsIgnoreCase("mejora"))
      .count();

    if (procedure.getGlobalMetrics() == null) {
      procedure.setGlobalMetrics(new GlobalMetrics());
    }
    procedure.getGlobalMetrics().setImprovementsCount((int) totalImprov);

  }

  public void updateAvgMark(String studentId) {
    Student student = studentRepository.findById(studentId).orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado."));
    List<Procedure> procedures = searchProcedures(student.getId(), null, null, null);

    if (procedures == null || procedures.isEmpty()) {
      student.setAvgMark(0.0);
      studentRepository.save(student);
      return;
    }

    double sum = 0.0; // acumulamos las notas
    for (Procedure procedure : procedures) {
      if (procedure.getGlobalMetrics() != null) {
        sum += procedure.getGlobalMetrics().getMark(); // Aquí sumamos el double directamente
      }
    }

    double finalAvg = sum / procedures.size();
    student.setAvgMark(finalAvg);
    studentRepository.save(student);
  }

  public Integer countByStudentId(String id){
    return procedureRepository.countByStudentId(id);
  }
  
  // filtrado dinámico reutilizable
  public List<Procedure> searchProcedures(String studentId, String professorId, String state, String protocolName) {
    Query query = new Query();
    List<Criteria> criteriaList = new ArrayList<>();

    if (studentId != null && !studentId.trim().isEmpty()) {
      criteriaList.add(Criteria.where("student").is(toObjectId(studentId)));
    }
    if (professorId != null && !professorId.trim().isEmpty()) {
      // Buscamos los alumnos que pertenecen a este profesor
      List<Student> myStudents = studentRepository.findByProfessor(professorId);
      
      if (myStudents == null || myStudents.isEmpty()) {
        return new ArrayList<>();
      }
      
      List<ObjectId> studentIds = myStudents.stream().map(s -> toObjectId(s.getId())).toList();
      criteriaList.add(Criteria.where("student").in(studentIds));
    }
    if (state != null && !state.trim().isEmpty()) {
      criteriaList.add(Criteria.where("state").is(state));
    }
    if (!criteriaList.isEmpty()) {
      query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
    }

    List<Procedure> results = mongoTemplate.find(query, Procedure.class);

    if (protocolName != null && !protocolName.trim().isEmpty()) {
      String lowerName = protocolName.toLowerCase().trim();
      results = results.stream()
      .filter(p -> p.getProtocol() != null && 
                  p.getProtocol().getTitle() != null && 
                  p.getProtocol().getTitle().toLowerCase().contains(lowerName))
      .toList();
    }

    return results;
  }

  public List<Procedure> getAllProcedures() {
    return procedureRepository.findAll();
  }



  public ProcedureResponse getProcedureById( String id) {
    Procedure procedure = procedureRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Procedimiento no encontrado."));

    Student student = procedure.getStudent();
    String studentId = (student != null) ? student.getId() : null;
    String studentName = (student != null) ? student.getName() : null;
    String studentSurname = (student != null) ? student.getSurname() : null;
    String professorName = (student != null && student.getProfessor() != null)
      ? student.getProfessor().getName()
      : "Sin profesor asignado";

    return new ProcedureResponse(
      procedure.getId(),
      studentId,
      studentName,
      studentSurname,
      professorName,
      procedure.getProtocol(),
      procedure.getDate(),
      procedure.getState(),
      procedure.getVideo(),
      procedure.getGlobalMetrics(),
      procedure.getAnnotations(),
      procedure.getComment(),
      procedure.getHololens()
    );
  }

  public Annotation addAnnotation(String procedureId, Annotation annotation) {
    Procedure procedure = procedureRepository.findById(procedureId).orElseThrow(() -> new ResourceNotFoundException("Procedimiento no encontrado."));

    if (procedure.getAnnotations() == null) {
        procedure.setAnnotations(new ArrayList<>());
    }

    annotation.setId(new ObjectId().toHexString());
    procedure.getAnnotations().add(annotation);
    updateErrorCount(procedure);
    updateImprovCount(procedure);

    procedureRepository.save(procedure);
    return annotation;
  }


  public Annotation editAnnotation(String procedureId, String annotationId, Annotation data) {

    Procedure procedure = procedureRepository.findById(procedureId).orElseThrow(() -> new ResourceNotFoundException("Procedimiento no encontrado."));
    
    if (procedure.getAnnotations() == null) {
      throw new ResourceNotFoundException("Anotación no encontrada");
    }

    Annotation annotation = procedure.getAnnotations().stream()
      .filter(a -> a.getId().equals(annotationId))
      .findFirst()
      .orElseThrow(() -> new ResourceNotFoundException("Anotación no encontrada"));

    // actualizar datos
    annotation.setMinute(data.getMinute());
    annotation.setTitle(data.getTitle());
    annotation.setDescription(data.getDescription());
    annotation.setType(data.getType());
    annotation.setTip(data.getTip());
    // actualizar conteo
    updateErrorCount(procedure);
    updateImprovCount(procedure);

    procedureRepository.save(procedure);
    return annotation;
  }


  public void deleteAnnotation(String procedureId, String annotationId) {
    Procedure procedure = procedureRepository.findById(procedureId).orElseThrow(() -> new ResourceNotFoundException("Procedimiento no encontrado."));
    
    if (procedure.getAnnotations() == null) {
      throw new ResourceNotFoundException("No se pudo eliminar, anotación no encontrada.");
    }

    boolean removed = procedure.getAnnotations().removeIf(a -> a.getId().equals(annotationId));
    
    if (!removed) {
      throw new ResourceNotFoundException("No se pudo eliminar, anotación no encontrada.");
    }

    // actualizar conteo
    updateErrorCount(procedure);
    updateImprovCount(procedure);
    procedureRepository.save(procedure);
  }


  public Procedure finalizeEvaluation(String procedureId, FinalizeEvaluationRequest evaluation) {

    Procedure procedure = procedureRepository.findById(procedureId).orElseThrow(() -> new ResourceNotFoundException("Procedimiento no encontrado."));

    if (evaluation.getMark() < 0 || evaluation.getMark() > 10) {
      throw new IllegalArgumentException("La nota debe estar entre 0 y 10.");
    }

    procedure.setState("Evaluado");
    procedure.setComment(evaluation.getComment());
    
    if (procedure.getGlobalMetrics() == null) {
      procedure.setGlobalMetrics(new com.nursEval.backend.model.embedded.GlobalMetrics());
    }
    procedure.getGlobalMetrics().setMark(evaluation.getMark());
    // actualizar la nota media del alumno
    updateAvgMark(procedure.getStudent().getId());

    return procedureRepository.save(procedure);
  }

}