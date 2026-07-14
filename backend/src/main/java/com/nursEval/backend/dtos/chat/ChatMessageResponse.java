package com.nursEval.backend.dtos.chat;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ChatMessageResponse {
  private String text;
  private List<Object> richContent;
}
