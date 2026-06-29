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
public class ProfessorStatsResponse {

    // Globales
    private int totalStudents;
    private int totalProcedures;
    private int evaluatedProcedures;
    private int pendingProcedures;
    private double avgMark;
    private double avgAttention;
    private double avgErrors;

    private List<ProtocolStats> byProtocol;
    private List<MonthStats> byMonth;
    private List<StudentRanking> studentRanking;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ProtocolStats {
      private String protocolName;
      private int total;
      private int passed;
      private int failed;
      private double avgMark;
      private double avgAttention;
      private double avgErrors;
    }

    @Data 
    @Builder 
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthStats {
      private int year;
      private int month;
      private int total;
      private int evaluated;
      private int pending;
      private double avgMark;
      private Map<String, Integer> totalByProtocol;
      private Map<String, Double> avgMarkByProtocol;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class StudentRanking {
      private String studentId;
      private String studentName;
      private int totalProcedures;
      private int evaluated;
      private int pending;
      private double avgMark;
      private String bestProtocol;   // protocolo con mejor nota
      private String worstProtocol;  // protocolo con peor nota
    }
}
