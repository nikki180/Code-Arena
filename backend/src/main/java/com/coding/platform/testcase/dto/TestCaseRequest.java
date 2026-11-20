package com.coding.platform.testcase.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestCaseRequest {

    @NotBlank
    private String inputData;

    @NotBlank
    private String expectedOutput;

    private Boolean isSample = false;

    private Boolean isHidden = true;
}