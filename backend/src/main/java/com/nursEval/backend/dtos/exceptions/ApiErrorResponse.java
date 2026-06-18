package com.nursEval.backend.dtos.exceptions;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL) 
public class ApiErrorResponse {
    private String status;       
    private int statusCode;       
    private String message;        // Mensaje para el cliente
    private LocalDateTime timestamp;
    private List<String> errors;   // Detalles adicionales (para fallos de validación en DTOs)
}
