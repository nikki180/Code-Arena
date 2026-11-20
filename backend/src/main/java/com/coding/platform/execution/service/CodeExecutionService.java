package com.coding.platform.execution.service;

import com.coding.platform.execution.dto.ExecutionResult;

public interface CodeExecutionService {

    ExecutionResult execute(
            String language,
            String sourceCode,
            String input,
            String expectedOutput
    );
}