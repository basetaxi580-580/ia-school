package com.iaschool.backend.model;

import java.util.List;

public record StudentSummary(
    long totalStudents,
    long activeStudents,
    long inactiveStudents,
    long graduatedStudents,
    long distinctPrograms,
    List<Student> recentStudents) {}
