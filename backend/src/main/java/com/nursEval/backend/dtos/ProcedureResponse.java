package com.nursEval.backend.dtos;

import java.time.LocalDate;
import java.util.List;

import com.nursEval.backend.model.Hololens;
import com.nursEval.backend.model.Protocol;
import com.nursEval.backend.model.Student;
import com.nursEval.backend.model.embedded.Annotation;
import com.nursEval.backend.model.embedded.GlobalMetrics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProcedureResponse {
  private String id;
  private String studentId; 
  private String studentName; 
  private String studentSurname; 
  private String professor; 
  private Protocol protocol;   
  private LocalDate date;
  private String state;
  private String video;
  private GlobalMetrics globalMetrics;
  private List<Annotation> annotations;
  private String comment;
  private Hololens hololens;  
}
