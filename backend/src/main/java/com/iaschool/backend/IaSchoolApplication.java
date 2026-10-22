package com.iaschool.backend;

import com.iaschool.backend.model.Student;
import com.iaschool.backend.repository.StudentRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class IaSchoolApplication {
  public static void main(String[] args) {
    SpringApplication.run(IaSchoolApplication.class, args);
  }

  @Bean
  CommandLineRunner seed(StudentRepository repository) {
    return args -> {
      if (repository.count() > 0) {
        return;
      }

      Instant now = Instant.now();
      List<Student> seeded = List.of(
          student("IA-001", "Carlos Tlelo", "carlos.tlelo@iaschool.mx", "Ingeniería de IA", "1A", "Activo", "Dra. Vega", "Alta de prueba", now),
          student("IA-002", "María Luna", "maria.luna@iaschool.mx", "Ciencia de Datos", "2B", "Activo", "Mtro. Rivera", "Progreso excelente", now),
          student("IA-003", "Javier Ramos", "javier.ramos@iaschool.mx", "Robótica", "3A", "Egresado", "Dra. Vega", "Cierre académico", now),
          student("IA-004", "Lucía Hernández", "lucia.hernandez@iaschool.mx", "Aprendizaje Automático", "1C", "Inactivo", "Mtro. Torres", "Pendiente de reinscripción", now)
      );
      repository.saveAll(seeded);
    };
  }

  private Student student(String code, String name, String email, String program, String group, String status, String advisor, String notes, Instant now) {
    Student s = new Student();
    s.setStudentCode(code);
    s.setFullName(name);
    s.setEmail(email);
    s.setProgram(program);
    s.setGroupName(group);
    s.setStatus(status);
    s.setAdvisor(advisor);
    s.setNotes(notes);
    s.setCreatedAt(now);
    s.setUpdatedAt(now);
    return s;
  }
}
