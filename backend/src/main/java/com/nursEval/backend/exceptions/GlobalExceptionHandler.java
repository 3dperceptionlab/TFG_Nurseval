// Basado en https://igventurelli.io/exception-handling-like-a-pro-in-spring-boot-rest-apis/
package com.nursEval.backend.exceptions;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.nursEval.backend.dtos.exceptions.ApiErrorResponse;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler { 

// --------- ERRORES 400 - BAD REQUEST ---------

  @ExceptionHandler(PasswordsDoNotMatchException.class) 
  @ResponseStatus(HttpStatus.BAD_REQUEST)               
  public ApiErrorResponse handlePasswordsDoNotMatch(PasswordsDoNotMatchException ex) {
    return ApiErrorResponse.builder()
      .status("KO")
      .statusCode(HttpStatus.BAD_REQUEST.value())
      .message(ex.getMessage()) 
      .timestamp(LocalDateTime.now())
      .build();
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ApiErrorResponse handleValidation(MethodArgumentNotValidException ex) {
    List<String> detalles = ex.getBindingResult().getFieldErrors().stream()
      .map(err -> err.getField() + ": " + err.getDefaultMessage())
      .collect(Collectors.toList());

    return ApiErrorResponse.builder()
      .status("KO")
      .statusCode(HttpStatus.BAD_REQUEST.value())
      .message("Validación de campos fallida.")
      .errors(detalles)
      .timestamp(LocalDateTime.now())
      .build();
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ApiErrorResponse handleMalformedJson(HttpMessageNotReadableException ex) {
    return ApiErrorResponse.builder()
      .status("KO")
      .statusCode(HttpStatus.BAD_REQUEST.value())
      .message("El JSON enviado tiene un formato inválido o faltan campos obligatorios.")
      .timestamp(LocalDateTime.now())
      .build();
  }
  
  @ExceptionHandler(IllegalArgumentException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ApiErrorResponse handleIllegalArgument(IllegalArgumentException ex) {
    return ApiErrorResponse.builder()
      .status("KO")
      .statusCode(HttpStatus.BAD_REQUEST.value())
      .message(ex.getMessage())
      .timestamp(LocalDateTime.now())
      .build();
  }

  // --------- ERRORES 401 - UNAUTHORIZED ---------

  @ExceptionHandler(InvalidRefreshTokenException.class)
  @ResponseStatus(HttpStatus.UNAUTHORIZED)
  public ApiErrorResponse handleInvalidRefreshToken(InvalidRefreshTokenException ex) {
    return ApiErrorResponse.builder()
      .status("KO")
      .statusCode(HttpStatus.UNAUTHORIZED.value())
      .message("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.")
      .timestamp(LocalDateTime.now())
      .build();
  }

  @ExceptionHandler(InvalidCredentialsException.class)
  @ResponseStatus(HttpStatus.UNAUTHORIZED)
  public ApiErrorResponse handleInvalidCredentials(InvalidCredentialsException ex) {
    return ApiErrorResponse.builder()
      .status("KO")
      .statusCode(HttpStatus.UNAUTHORIZED.value())
      .message(ex.getMessage())
      .timestamp(LocalDateTime.now())
      .build();
  }
  // --------- ERRORES 403 - FORBIDDEN --------- 

  @ExceptionHandler(AccountInactiveException.class)
  @ResponseStatus(HttpStatus.FORBIDDEN)
  public ApiErrorResponse handleAccountInactive(AccountInactiveException ex) {
    return ApiErrorResponse.builder()
      .status("KO")
      .statusCode(HttpStatus.FORBIDDEN.value())
      .message("Lo sentimos, su cuenta se encuentra inactiva")
      .timestamp(LocalDateTime.now())
      .build();
  }

  @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
  @ResponseStatus(HttpStatus.FORBIDDEN)
  public ApiErrorResponse handleAccessDenied(org.springframework.security.access.AccessDeniedException ex) {
    return ApiErrorResponse.builder()
      .status("KO")
      .statusCode(HttpStatus.FORBIDDEN.value())
      .message("No tienes permisos para realizar esta acción.")
      .timestamp(LocalDateTime.now())
      .build();
  }

  // --------- ERRORES 404 - NOT FOUND --------- 

  @ExceptionHandler(ResourceNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public ApiErrorResponse handleResourceNotFound(ResourceNotFoundException ex) {
    return ApiErrorResponse.builder()
      .status("KO")
      .statusCode(HttpStatus.NOT_FOUND.value())
      .message(ex.getMessage()) 
      .timestamp(LocalDateTime.now())
      .build();
  }

  @ExceptionHandler(NoResourceFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public ApiErrorResponse handleRouteNotFound(NoResourceFoundException ex) {
    return ApiErrorResponse.builder()
      .status("KO")
      .statusCode(HttpStatus.NOT_FOUND.value())
      .message("La ruta solicitada no existe.")
      .timestamp(LocalDateTime.now())
      .build();
  }


  // --------- ERRORES 405 - METHOD NOT ALLOWED ---------

  @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
  @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
  public ApiErrorResponse handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
    return ApiErrorResponse.builder()
      .status("KO")
      .statusCode(HttpStatus.METHOD_NOT_ALLOWED.value())
      .message("Método HTTP no permitido para esta ruta.")
      .timestamp(LocalDateTime.now())
      .build();
  }


  // --------- ERRORES 409 - CONFLICT ---------

  @ExceptionHandler(EmailAlreadyExistsException.class)
  @ResponseStatus(HttpStatus.CONFLICT)
  public ApiErrorResponse handleEmailAlreadyExists(EmailAlreadyExistsException ex) {
      return ApiErrorResponse.builder()
        .status("KO")
        .statusCode(HttpStatus.CONFLICT.value())
        .message("El email ya está registrado")
        .timestamp(LocalDateTime.now())
        .build();
  }

  // --------- ERRORES 502 - BAD GATEWAY ---------

  @ExceptionHandler(DialogflowIntegrationException.class)
  @ResponseStatus(HttpStatus.BAD_GATEWAY)
  public ApiErrorResponse handleDialogflowIntegration(DialogflowIntegrationException ex) {
    return ApiErrorResponse.builder()
      .status("KO")
      .statusCode(HttpStatus.BAD_GATEWAY.value())
      .message(ex.getMessage())
      .timestamp(LocalDateTime.now())
      .build();
  }

  // --------- ERRORES 500 - INTERNAL SERVER ERROR ---------

  @ExceptionHandler(Exception.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ApiErrorResponse handleGlobalException(Exception ex) {
    log.error("Excepción interna no controlada detectada: ", ex);
    
    return ApiErrorResponse.builder()
      .status("KO")
      .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
      .message("Ha ocurrido un error interno en el servidor.")
      .timestamp(LocalDateTime.now())
      .build();
  }
}