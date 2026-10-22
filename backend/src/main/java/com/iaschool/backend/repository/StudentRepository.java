package com.iaschool.backend.repository;

import com.iaschool.backend.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StudentRepository extends MongoRepository<Student, String> {}
