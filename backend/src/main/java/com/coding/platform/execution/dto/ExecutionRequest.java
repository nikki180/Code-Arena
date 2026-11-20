package com.coding.platform.execution.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExecutionRequest {

    @NotBlank
    private String language;

    @NotBlank
    private String sourceCode;

    private String input = "";

    private String expectedOutput = "";

    private boolean compareOutput = true;
}
