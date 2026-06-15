package com.nursEval.backend.model.embedded;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Frame {
  private double time;
  private Position rightHandPos;
  private Rotation rightHandRot;
  private Position leftHandPos;
  private Rotation leftHandRot;
  private Position headPos;
  private Rotation headRot;
  private Position eyeTrackerPos;
  private Position eyeTrackerDir;
}
