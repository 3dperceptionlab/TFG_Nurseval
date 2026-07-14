package com.nursEval.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nursEval.backend.dtos.chat.ChatMessageRequest;
import com.nursEval.backend.dtos.chat.ChatMessageResponse;
import com.nursEval.backend.service.DialogflowSessionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

  private final DialogflowSessionService dialogflowSessionService;

  @PostMapping("/message")
  public ResponseEntity<ChatMessageResponse> sendMessage(@Valid @RequestBody ChatMessageRequest request) {
    ChatMessageResponse response = dialogflowSessionService.sendMessage(request.getSessionId(), request.getMessage());
    return ResponseEntity.ok(response);
  }
}
