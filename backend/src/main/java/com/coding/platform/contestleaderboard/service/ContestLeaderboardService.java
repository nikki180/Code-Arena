package com.coding.platform.contestleaderboard.service;

import java.util.List;

import com.coding.platform.contestleaderboard.dto.ContestLeaderboardResponse;

public interface ContestLeaderboardService {

    List<ContestLeaderboardResponse> getLeaderboard(
            Long contestId);

    ContestLeaderboardResponse getMyLeaderboardEntry(
            Long contestId);
}