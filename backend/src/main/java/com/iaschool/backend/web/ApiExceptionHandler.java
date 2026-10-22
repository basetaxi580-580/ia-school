package com.iaschool.backend.web;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("message", "Validation failed");
    body.put("status", 400);
    body.put("errors", ex.getBindingResult().getFieldErrors().stream().map(this::fieldError).toList());
    return ResponseEntity.badRequest().body(body);
  }

  @ExceptionHandler(ResponseStatusException.class)
  public ResponseEntity<Map<String, Object>> handleStatus(ResponseStatusException ex) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("message", ex.getReason());
    body.put("status", ex.getStatusCode().value());
    return ResponseEntity.status(ex.getStatusCode()).body(body);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("message", "Unexpected error");
    body.put("status", 500);
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
  }

  private Map<String, String> fieldError(FieldError error) {
    Map<String, String> item = new LinkedHashMap<>();
    item.put("field", error.getField());
    item.put("message", error.getDefaultMessage());
    return item;
  }
}
