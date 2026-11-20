package com.coding.platform.judge.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JudgeResult {

    private boolean accepted;

    private String status;

    private String message;

    private Integer totalTestCases;

    private Integer passedTestCases;

    private Long executionTime;

    private String error;

    private List<TestCaseResult> testCaseResults;
}