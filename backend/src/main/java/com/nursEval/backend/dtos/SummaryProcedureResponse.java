package com.nursEval.backend.dtos;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import com.nursEval.backend.dtos.auth.UserProfileResponse;
import com.nursEval.backend.model.Student;
import com.nursEval.backend.model.embedded.GlobalMetrics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SummaryProcedureResponse {
  @Id
  private String id;

  @DocumentReference
  private UserProfileResponse student; 

  private String protocolName;
  
  private LocalDate date;
  private String state;
  private GlobalMetrics globalMetrics;
}
