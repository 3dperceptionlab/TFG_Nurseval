package com.nursEval.backend.exceptions;

public class DialogflowIntegrationException extends RuntimeException {
  public DialogflowIntegrationException(String message) {
    super(message);
  }

  public DialogflowIntegrationException(String message, Throwable cause) {
    super(message, cause);
  }
}
