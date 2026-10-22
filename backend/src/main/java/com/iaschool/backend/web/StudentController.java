package com.iaschool.backend.web;

import com.iaschool.backend.model.Student;
import com.iaschool.backend.model.StudentSummary;
import com.iaschool.backend.service.StudentService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/students")
public class StudentController {
  private final StudentService service;

  public StudentController(StudentService service) {
    this.service = service;
  }

  @GetMapping
  public List<Student> all() {
    return service.findAll();
  }

  @GetMapping("/{id}")
  public Student byId(@PathVariable String id) {
    return service.findById(id);
  }

  @GetMapping("/summary")
  public StudentSummary summary() {
    return service.summary();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Student create(@Valid @RequestBody Student payload) {
    return service.create(payload);
  }

  @PutMapping("/{id}")
  public Student update(@PathVariable String id, @Valid @RequestBody Student payload) {
    return service.update(id, payload);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable String id) {
    service.delete(id);
  }
}
