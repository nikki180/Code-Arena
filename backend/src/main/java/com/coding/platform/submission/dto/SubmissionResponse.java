package com.coding.platform.submission.dto;

import java.time.LocalDateTime;

import com.coding.platform.submission.entity.ProgrammingLanguage;
import com.coding.platform.submission.entity.SubmissionStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionResponse {

    private Long id;

    private Long userId;

    private Long problemId;

    private ProgrammingLanguage language;

    private String sourceCode;

    private SubmissionStatus status;

    private LocalDateTime submittedAt;
}