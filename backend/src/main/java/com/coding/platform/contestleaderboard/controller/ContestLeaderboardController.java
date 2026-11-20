package com.coding.platform.contestleaderboard.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coding.platform.contestleaderboard.dto.ContestLeaderboardResponse;
import com.coding.platform.contestleaderboard.service.ContestLeaderboardService;

@RestController
@RequestMapping("/api/contest-leaderboard")
public class ContestLeaderboardController {

    private final ContestLeaderboardService leaderboardService;

    public ContestLeaderboardController(
            ContestLeaderboardService leaderboardService) {

        this.leaderboardService = leaderboardService;
    }

    @GetMapping("/{contestId}")
    public List<ContestLeaderboardResponse> getLeaderboard(
            @PathVariable Long contestId) {

        return leaderboardService.getLeaderboard(
                contestId);
    }

    @GetMapping("/{contestId}/my")
    public ContestLeaderboardResponse getMyLeaderboardEntry(
            @PathVariable Long contestId) {

        return leaderboardService.getMyLeaderboardEntry(
                contestId);
    }
}