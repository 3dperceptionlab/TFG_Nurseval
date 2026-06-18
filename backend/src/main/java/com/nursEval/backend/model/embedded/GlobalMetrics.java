package com.nursEval.backend.model.embedded;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GlobalMetrics {
  private double duration;
  private int errorCount;
  private double attentionPercent;
  private double mark;
}
