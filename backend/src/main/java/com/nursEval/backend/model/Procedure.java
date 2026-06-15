package com.nursEval.backend.model;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.nursEval.backend.model.embedded.Annotation;
import com.nursEval.backend.model.embedded.GlobalMetrics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document("procedures")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Procedure {
 
  @Id
  private String id;

  private String student;  // referencia al id de Student
  private String protocol; // referencia al id de Protocol
  private LocalDate date;
  private String state;
  private String video;
  private GlobalMetrics globalMetrics;
  private List<Annotation> annotations;
  private String comment;
  private String hololens; // referencia al id de Hololens
}
