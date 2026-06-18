package com.nursEval.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nursEval.backend.model.Protocol;
import com.nursEval.backend.service.ProtocolService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/protocols")
@RequiredArgsConstructor
public class ProtocolController {
private final ProtocolService protocolService;

  @GetMapping
  public ResponseEntity<List<Protocol>> getAll() {
      return ResponseEntity.ok(protocolService.getAll());
  }

  @GetMapping("/{id}")
  public ResponseEntity<Protocol> getById(@PathVariable String id) {
      return ResponseEntity.ok(protocolService.getById(id));
  }

}
