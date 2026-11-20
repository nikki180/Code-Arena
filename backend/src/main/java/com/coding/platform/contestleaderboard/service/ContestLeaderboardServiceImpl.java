package com.coding.platform.contestleaderboard.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coding.platform.contest.repository.ContestRepository;
import com.coding.platform.contestleaderboard.dto.ContestLeaderboardResponse;
import com.coding.platform.contestscore.entity.ContestScore;
import com.coding.platform.contestscore.repository.ContestScoreRepository;
import com.coding.platform.exception.ResourceNotFoundException;
import com.coding.platform.user.entity.User;
import com.coding.platform.user.repository.UserRepository;

@Service
@Transactional(readOnly = true)
public class ContestLeaderboardServiceImpl
        implements ContestLeaderboardService {

    private final ContestRepository contestRepository;
    private final ContestScoreRepository scoreRepository;
    private final UserRepository userRepository;

    public ContestLeaderboardServiceImpl(
            ContestRepository contestRepository,
            ContestScoreRepository scoreRepository,
            UserRepository userRepository) {

        this.contestRepository = contestRepository;
        this.scoreRepository = scoreRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<ContestLeaderboardResponse> getLeaderboard(
            Long contestId) {

        contestRepository.findById(contestId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Contest not found with id: " + contestId));

        return scoreRepository
                .findByContestIdOrderByTotalScoreDesc(contestId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ContestLeaderboardResponse getMyLeaderboardEntry(
            Long contestId) {

        contestRepository.findById(contestId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Contest not found with id: " + contestId));

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Logged-in user not found"));

        ContestScore score =
                scoreRepository
                        .findByContestIdAndUserId(
                                contestId,
                                user.getId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Contest score not found"));

        return mapToResponse(score);
    }

    private ContestLeaderboardResponse mapToResponse(
            ContestScore score) {

        return ContestLeaderboardResponse.builder()
                .rank(score.getCurrentRank())
                .userId(score.getUserId())
                .totalScore(score.getTotalScore())
                .problemsSolved(score.getProblemsSolved())
                .totalSubmissions(score.getTotalSubmissions())
                .build();
    }
}