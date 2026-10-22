package com.iaschool.backend.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("students")
public class Student {
  @Id
  private String id;

  @NotBlank
  private String studentCode;

  @NotBlank
  private String fullName;

  @NotBlank
  @Email
  private String email;

  @NotBlank
  private String program;

  @NotBlank
  private String groupName;

  @NotBlank
  private String status;

  private String advisor;
  private String notes;
  private Instant createdAt;
  private Instant updatedAt;

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getStudentCode() { return studentCode; }
  public void setStudentCode(String studentCode) { this.studentCode = studentCode; }
  public String getFullName() { return fullName; }
  public void setFullName(String fullName) { this.fullName = fullName; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getProgram() { return program; }
  public void setProgram(String program) { this.program = program; }
  public String getGroupName() { return groupName; }
  public void setGroupName(String groupName) { this.groupName = groupName; }
  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
  public String getAdvisor() { return advisor; }
  public void setAdvisor(String advisor) { this.advisor = advisor; }
  public String getNotes() { return notes; }
  public void setNotes(String notes) { this.notes = notes; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
  public Instant getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
