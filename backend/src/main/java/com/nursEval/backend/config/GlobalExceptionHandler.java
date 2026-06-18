package com.nursEval.backend.config;

import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.nursEval.backend.dtos.http.ApiResponse;
import com.nursEval.backend.exceptions.EmailAlreadyExistsException;
import com.nursEval.backend.exceptions.ResourceNotFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

  // --------- ERRORES 400 - BAD REQUEST ---------

  // Para fallos de validación (@Valid)
  @ExceptionHandler(MethodArgumentNotValidException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ApiResponse<?> handleValidation(MethodArgumentNotValidException ex) {
      String detalles = ex.getBindingResult().getFieldErrors().stream()
              .map(err -> err.getField() + ": " + err.getDefaultMessage())
              .collect(Collectors.joining(", "));
      return new ApiResponse<>("ERROR", "Campos inválidos: " + detalles);
  }

  // Para JSON mal formados
  @ExceptionHandler(HttpMessageNotReadableException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ApiResponse<?> handleMalformedJson(HttpMessageNotReadableException ex) {
      return new ApiResponse<>("ERROR", "El JSON enviado tiene un formato inválido.");
  }



  // --------- ERRORES 404 - NOT FOUND --------- 

  // 404 Recurso no encontrado
  @ExceptionHandler(ResourceNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public ApiResponse<?> handleResourceNotFound(ResourceNotFoundException ex) {
      return new ApiResponse<>("ERROR", ex.getMessage());
  }

  // 404 URL no encontrada
  @ExceptionHandler(NoResourceFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public ApiResponse<?> handleRouteNotFound(NoResourceFoundException ex) {
      return new ApiResponse<>("ERROR", "La ruta solicitada no existe.");
  }



  // --------- ERRORES 405 - METHOD NOT ALLOWED ---------

  @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
  @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
  public ApiResponse<?> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
      return new ApiResponse<>("ERROR", "Método HTTP no permitido para esta ruta.");
  }



  // --------- ERRORES 409 - CONFLICT ---------

  @ExceptionHandler(EmailAlreadyExistsException.class)
  @ResponseStatus(HttpStatus.CONFLICT)
  public ApiResponse<?> handleEmailConflict(EmailAlreadyExistsException ex) {
      return new ApiResponse<>("ERROR", ex.getMessage());
  }



  // --------- ERRORES 500 - INTERNAL SERVER ERROR ---------

  @ExceptionHandler(Exception.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ApiResponse<?> handleGlobalException(Exception ex) {
      ex.printStackTrace();
      return new ApiResponse<>("ERROR", "Ha ocurrido un error interno en el servidor.");
  }
}
