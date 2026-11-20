package com.coding.platform.leaderboard.service;

import java.util.List;

import com.coding.platform.leaderboard.dto.LeaderboardResponse;

public interface LeaderboardService {

    List<LeaderboardResponse> getLeaderboard();

}