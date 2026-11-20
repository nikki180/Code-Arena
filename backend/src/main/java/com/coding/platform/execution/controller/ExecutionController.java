package com.coding.platform.execution.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.coding.platform.execution.dto.ExecutionResult;
import com.coding.platform.execution.dto.ExecutionRequest;
import com.coding.platform.execution.service.CodeExecutionService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/execution")
public class ExecutionController {

    private final CodeExecutionService codeExecutionService;

    public ExecutionController(
            CodeExecutionService codeExecutionService) {

        this.codeExecutionService = codeExecutionService;
    }

    @PostMapping("/run")
    @ResponseStatus(HttpStatus.OK)
    public ExecutionResult executeCode(
            @Valid @RequestBody ExecutionRequest request) {

        return codeExecutionService.execute(
                request.getLanguage(),
                request.getSourceCode(),
                request.getInput(),
                request.isCompareOutput() ? request.getExpectedOutput() : null
        );
    }
}
