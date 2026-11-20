package com.coding.platform.contest.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContestResponse {

    private Long id;

    private String title;

    private String description;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Long createdBy;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}