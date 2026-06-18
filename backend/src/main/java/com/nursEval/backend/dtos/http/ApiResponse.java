package com.nursEval.backend.dtos.http;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(String result, String message,T data) {
  
    public ApiResponse(String result, String message) {
        this(result, message, null);
    }
}
