package com.coding.platform.contestsubmission.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContestSubmissionEvaluationRequest {

    @NotBlank(message = "Status is required")
    private String status;

    @Min(value = 0, message = "Score cannot be negative")
    private Integer score;
}