package com.coding.platform.testcase.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestCaseResponse {

    private Long id;

    private Long problemId;

    private String inputData;

    private String expectedOutput;

    private Boolean isSample;

    private Boolean isHidden;

    private LocalDateTime createdAt;
}