package com.coding.platform.submission.dto;

import com.coding.platform.submission.entity.ProgrammingLanguage;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Problem ID is required")
    private Long problemId;

    @NotNull(message = "Language is required")
    private ProgrammingLanguage language;

    @NotBlank(message = "Source code is required")
    private String sourceCode;
}