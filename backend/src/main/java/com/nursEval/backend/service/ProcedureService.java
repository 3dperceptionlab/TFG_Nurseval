package com.nursEval.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.nursEval.backend.dtos.FinalizeEvaluationRequest;
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
  
  // filtrado dinámico reutilizable
  public List<Procedure> searchProcedures(String studentId, String professorId, String state, String protocolName) {
    Query query = new Query();
    List<Criteria> criteriaList = new ArrayList<>();

    if (studentId != null && !studentId.trim().isEmpty()) {
      criteriaList.add(Criteria.where("student").is(new ObjectId(studentId)));
    }
    if (professorId != null && !professorId.trim().isEmpty()) {
      // Buscamos los alumnos que pertenecen a este profesor
      List<Student> myStudents = studentRepository.findByProfessor(professorId);
      
      if (myStudents == null || myStudents.isEmpty()) {
        return new ArrayList<>();
      }
      
      List<ObjectId> studentIds = myStudents.stream().map(s -> new ObjectId(s.getId())).toList();
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

  public Procedure getProcedureById( String id) {
    return procedureRepository.findById(id).orElseThrow(() -> new RuntimeException("Procedimiento no encontrado"));
  }

  public Annotation addAnnotation(String procedureId, Annotation annotation) {
    Procedure procedure = getProcedureById(procedureId);

    if (procedure.getAnnotations() == null) {
        procedure.setAnnotations(new ArrayList<>());
    }

    annotation.setId(new ObjectId().toHexString());
    procedure.getAnnotations().add(annotation);
    updateErrorCount(procedure);

    procedureRepository.save(procedure);
    return annotation;
  }


  public Annotation editAnnotation(String procedureId, String annotationId, Annotation data) {
    Procedure procedure = getProcedureById(procedureId);

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

    procedureRepository.save(procedure);
    return annotation;
  }


  public void deleteAnnotation(String procedureId, String annotationId) {
    Procedure procedure = getProcedureById(procedureId);
    
    boolean removed = procedure.getAnnotations().removeIf(a -> a.getId().equals(annotationId));
    
    if (!removed) {
      throw new ResourceNotFoundException("No se pudo eliminar, anotación no encontrada.");
    }

    // actualizar conteo
    updateErrorCount(procedure);
    procedureRepository.save(procedure);
  }


  public Procedure finalizeEvaluation(String id, FinalizeEvaluationRequest evaluation) {

    Procedure procedure = getProcedureById(id);
    procedure.setState("Evaluado");
    procedure.setComment(evaluation.getComment());
    
    if (procedure.getGlobalMetrics() == null) {
      procedure.setGlobalMetrics(new com.nursEval.backend.model.embedded.GlobalMetrics());
    }
    procedure.getGlobalMetrics().setMark(evaluation.getMark());

    return procedureRepository.save(procedure);
  }

}
