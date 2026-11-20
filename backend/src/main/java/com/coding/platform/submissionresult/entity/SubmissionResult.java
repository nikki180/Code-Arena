package com.coding.platform.submissionresult.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "submission_results")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "submission_id", nullable = false)
    private Long submissionId;

    @Column(name = "total_test_cases")
    private Integer totalTestCases;

    @Column(name = "passed_test_cases")
    private Integer passedTestCases;

    @Column(name = "failed_test_cases")
    private Integer failedTestCases;

    @Column(name = "execution_time")
    private BigDecimal executionTime;

    @Column(name = "memory_used")
    private BigDecimal memoryUsed;

    @Column(name = "score")
    private Integer score;

    @Column(name = "verdict")
    private String verdict;

    @Column(name = "evaluated_at")
    private LocalDateTime evaluatedAt;
}