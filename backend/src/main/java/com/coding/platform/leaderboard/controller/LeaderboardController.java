package com.coding.platform.leaderboard.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coding.platform.leaderboard.dto.LeaderboardResponse;
import com.coding.platform.leaderboard.service.LeaderboardService;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(
            LeaderboardService leaderboardService) {

        this.leaderboardService = leaderboardService;
    }

    // =========================================================
    // GET LEADERBOARD
    // USER + ADMIN
    // =========================================================

    @GetMapping
    public List<LeaderboardResponse> getLeaderboard() {

        return leaderboardService.getLeaderboard();
    }
}