package com.coding.platform.dashboard.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentSubmissionResponse {

    private Long submissionId;

    private Long problemId;

    private String problemTitle;

    private String language;

    private String status;

    private LocalDateTime submittedAt;
}