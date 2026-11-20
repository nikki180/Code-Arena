package com.coding.platform.contestscore.service;

import java.util.List;

import com.coding.platform.contestscore.dto.ContestLeaderboardResponse;

public interface ContestScoreService {

    List<ContestLeaderboardResponse> getContestLeaderboard(
            Long contestId);

    ContestLeaderboardResponse getMyContestScore(
            Long contestId);

    void recalculateUserScore(
            Long contestId,
            Long userId);

    void recalculateContestRanks(
            Long contestId);
}