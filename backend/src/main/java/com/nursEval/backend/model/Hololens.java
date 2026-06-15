package com.nursEval.backend.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.nursEval.backend.model.embedded.Frame;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document("hololens")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Hololens {
 
  @Id
  private String id;

  private List<Frame> frames;
}
