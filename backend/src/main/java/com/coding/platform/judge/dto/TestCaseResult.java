package com.coding.platform.judge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestCaseResult {

    private Integer testCaseNumber;

    private boolean passed;

    private String input;

    private String expectedOutput;

    private String actualOutput;

    private String error;

    private Long executionTime;
}