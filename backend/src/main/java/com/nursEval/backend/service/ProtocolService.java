package com.nursEval.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.nursEval.backend.model.Protocol;
import com.nursEval.backend.repository.ProtocolRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProtocolService {
  
  private final ProtocolRepository protocolRepository;

  public List<Protocol> getAll() {
    return protocolRepository.findAll();
  }

  public Protocol getById( String id) {
    return protocolRepository.findById(id).orElseThrow(() -> new RuntimeException("Protocolo no encontrado con id: " + id));
  }
}
