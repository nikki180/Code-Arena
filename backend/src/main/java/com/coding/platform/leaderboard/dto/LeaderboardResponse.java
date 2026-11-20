package com.coding.platform.leaderboard.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardResponse {

    private Long id;

    private Long userId;

    private String fullName;

    private Integer totalScore;

    private Integer totalProblemsSolved;

    private Integer totalSubmissions;

    private Integer currentRank;

    private LocalDateTime lastSubmissionAt;

    private LocalDateTime updatedAt;
}
