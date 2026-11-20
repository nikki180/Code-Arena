package com.coding.platform.contestproblem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContestProblemResponse {

    private Long id;

    private Long contestId;

    private Long problemId;

    private Integer problemOrder;

    private Integer points;
}