package com.nursEval.backend.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.nursEval.backend.model.embedded.Step;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document("protocols")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Protocol {
 
  @Id
  private String id;

  private String title;
  private String purpose;
  private List<String> materials;
  private String image;
  private List<Step> steps;
  private String video;
}
