package com.coding.platform.submissionresult.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionResultResponse {

    private Long id;

    private Long submissionId;

    private Integer totalTestCases;

    private Integer passedTestCases;

    private Integer failedTestCases;

    private BigDecimal executionTime;

    private BigDecimal memoryUsed;

    private Integer score;

    private String verdict;

    private LocalDateTime evaluatedAt;
}