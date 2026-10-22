package com.iaschool.backend.service;

import com.iaschool.backend.model.Student;
import com.iaschool.backend.model.StudentSummary;
import com.iaschool.backend.repository.StudentRepository;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class StudentService {
  private final StudentRepository repository;

  public StudentService(StudentRepository repository) {
    this.repository = repository;
  }

  public List<Student> findAll() {
    return repository.findAll().stream()
        .sorted(Comparator.comparing(Student::getFullName, String.CASE_INSENSITIVE_ORDER))
        .toList();
  }

  public Student findById(String id) {
    return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
  }

  public Student create(Student payload) {
    Student student = copyForSave(payload, new Student(), true);
    return repository.save(student);
  }

  public Student update(String id, Student payload) {
    Student existing = findById(id);
    copyForSave(payload, existing, false);
    existing.setUpdatedAt(Instant.now());
    return repository.save(existing);
  }

  public void delete(String id) {
    repository.delete(findById(id));
  }

  public StudentSummary summary() {
    List<Student> all = findAll();
    long active = countStatus(all, "activo");
    long inactive = countStatus(all, "inactivo");
    long graduated = countStatus(all, "egresado");
    long programs = all.stream().map(Student::getProgram).filter(v -> v != null && !v.isBlank()).distinct().count();
    List<Student> recent = all.stream()
        .sorted(Comparator.comparing(Student::getUpdatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
        .limit(5)
        .toList();
    return new StudentSummary(all.size(), active, inactive, graduated, programs, recent);
  }

  private long countStatus(List<Student> students, String status) {
    return students.stream()
        .filter(student -> student.getStatus() != null)
        .filter(student -> student.getStatus().toLowerCase(Locale.ROOT).equals(status))
        .count();
  }

  private Student copyForSave(Student source, Student target, boolean isCreate) {
    target.setStudentCode(source.getStudentCode().trim());
    target.setFullName(source.getFullName().trim());
    target.setEmail(source.getEmail().trim());
    target.setProgram(source.getProgram().trim());
    target.setGroupName(source.getGroupName().trim());
    target.setStatus(source.getStatus().trim());
    target.setAdvisor(source.getAdvisor() == null ? "" : source.getAdvisor().trim());
    target.setNotes(source.getNotes() == null ? "" : source.getNotes().trim());
    if (isCreate) {
      target.setId(null);
      target.setCreatedAt(Instant.now());
    } else if (target.getCreatedAt() == null) {
      target.setCreatedAt(Instant.now());
    }
    target.setUpdatedAt(Instant.now());
    return target;
  }
}
