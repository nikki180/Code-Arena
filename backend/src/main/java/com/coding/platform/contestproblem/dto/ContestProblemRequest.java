package com.coding.platform.contestproblem.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContestProblemRequest {

    @NotNull(message = "Contest ID is required")
    private Long contestId;

    @NotNull(message = "Problem ID is required")
    private Long problemId;

    @NotNull(message = "Problem order is required")
    @Min(value = 1, message = "Problem order must be at least 1")
    private Integer problemOrder;

    @NotNull(message = "Points are required")
    @Min(value = 1, message = "Points must be at least 1")
    private Integer points;
}