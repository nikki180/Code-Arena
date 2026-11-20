package com.coding.platform.contestleaderboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContestLeaderboardResponse {

    private Integer rank;

    private Long userId;

    private Integer totalScore;

    private Integer problemsSolved;

    private Integer totalSubmissions;
}