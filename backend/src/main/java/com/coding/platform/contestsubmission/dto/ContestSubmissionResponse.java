package com.coding.platform.contestsubmission.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContestSubmissionResponse {

    private Long id;

    private Long contestId;

    private Long userId;

    private Long problemId;

    private String language;

    private String status;

    private Integer score;

    private LocalDateTime submittedAt;
}