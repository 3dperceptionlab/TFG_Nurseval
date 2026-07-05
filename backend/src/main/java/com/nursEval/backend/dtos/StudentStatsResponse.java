package com.nursEval.backend.dtos;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentStatsResponse {
  private int totalProcedures;
  private int evaluatedProcedures;
  private int pendingProcedures;
  private double avgMark;
  private double avgImprov;
  private double avgErrors;
  private List<ProtocolStats> byProtocol;
  private List<MonthStats> byMonth;

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class ProtocolStats {
    private String protocolName;
    private int total;
    private int passed;  
    private int failed;
    private double avgMark;
  }

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class MonthStats {
    private int year;
    private int month;
    private int total;
    private double avgMark;
    private Map<String, Integer> totalByProtocol; 
    private Map<String, Double> avgMarkByProtocol;
  }
}