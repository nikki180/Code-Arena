package com.coding.platform.execution.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExecutionResult {

    private boolean success;

    private String status;

    private String output;

    private String errorMessage;

    private Long executionTime;

    private Long memoryUsed;

    private Integer testCasesPassed;

    private Integer totalTestCases;
}