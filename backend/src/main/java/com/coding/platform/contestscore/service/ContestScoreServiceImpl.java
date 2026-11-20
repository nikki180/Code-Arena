package com.coding.platform.contestscore.service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coding.platform.contest.repository.ContestRepository;
import com.coding.platform.contestproblem.entity.ContestProblem;
import com.coding.platform.contestproblem.repository.ContestProblemRepository;
import com.coding.platform.contestscore.dto.ContestLeaderboardResponse;
import com.coding.platform.contestscore.entity.ContestScore;
import com.coding.platform.contestscore.repository.ContestScoreRepository;
import com.coding.platform.contestsubmission.entity.ContestSubmission;
import com.coding.platform.contestsubmission.repository.ContestSubmissionRepository;
import com.coding.platform.exception.ResourceNotFoundException;
import com.coding.platform.user.entity.User;
import com.coding.platform.user.repository.UserRepository;

@Service
@Transactional
public class ContestScoreServiceImpl
        implements ContestScoreService {

    private final ContestScoreRepository scoreRepository;
    private final ContestRepository contestRepository;
    private final ContestProblemRepository contestProblemRepository;
    private final ContestSubmissionRepository submissionRepository;
    private final UserRepository userRepository;

    public ContestScoreServiceImpl(
            ContestScoreRepository scoreRepository,
            ContestRepository contestRepository,
            ContestProblemRepository contestProblemRepository,
            ContestSubmissionRepository submissionRepository,
            UserRepository userRepository) {

        this.scoreRepository = scoreRepository;
        this.contestRepository = contestRepository;
        this.contestProblemRepository = contestProblemRepository;
        this.submissionRepository = submissionRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContestLeaderboardResponse> getContestLeaderboard(
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
    @Transactional(readOnly = true)
    public ContestLeaderboardResponse getMyContestScore(
            Long contestId) {

        contestRepository.findById(contestId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Contest not found with id: " + contestId));

        User user = getLoggedInUser();

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

    @Override
    public void recalculateUserScore(
            Long contestId,
            Long userId) {

        contestRepository.findById(contestId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Contest not found with id: " + contestId));

        List<ContestSubmission> submissions =
                submissionRepository
                        .findByContestIdAndUserIdOrderBySubmittedAtDesc(
                                contestId,
                                userId);

        List<ContestProblem> contestProblems =
                contestProblemRepository
                        .findByContestIdOrderByProblemOrderAsc(
                                contestId);

        Map<Long, Integer> problemPoints = new HashMap<>();

        for (ContestProblem contestProblem : contestProblems) {

            problemPoints.put(
                    contestProblem.getProblemId(),
                    contestProblem.getPoints());
        }

        int totalSubmissions = submissions.size();

        Map<Long, Boolean> solvedProblems = new HashMap<>();

        for (ContestSubmission submission : submissions) {

            if ("ACCEPTED".equalsIgnoreCase(
                    submission.getStatus())) {

                solvedProblems.put(
                        submission.getProblemId(),
                        true);
            }
        }

        int problemsSolved = solvedProblems.size();

        int totalScore = 0;

        for (Long problemId : solvedProblems.keySet()) {

            Integer points = problemPoints.get(problemId);

            if (points != null) {
                totalScore += points;
            }
        }

        ContestScore score =
                scoreRepository
                        .findByContestIdAndUserId(
                                contestId,
                                userId)
                        .orElseGet(() ->
                                ContestScore.builder()
                                        .contestId(contestId)
                                        .userId(userId)
                                        .totalScore(0)
                                        .problemsSolved(0)
                                        .totalSubmissions(0)
                                        .currentRank(0)
                                        .build());

        score.setTotalScore(totalScore);
        score.setProblemsSolved(problemsSolved);
        score.setTotalSubmissions(totalSubmissions);
        score.setUpdatedAt(LocalDateTime.now());

        scoreRepository.save(score);

        recalculateContestRanks(contestId);
    }

    @Override
    public void recalculateContestRanks(
            Long contestId) {

        List<ContestScore> scores =
                scoreRepository
                        .findByContestIdOrderByTotalScoreDesc(
                                contestId);

        scores.sort(
                Comparator
                        .comparing(
                                ContestScore::getTotalScore,
                                Comparator.reverseOrder())
                        .thenComparing(
                                ContestScore::getProblemsSolved,
                                Comparator.reverseOrder())
                        .thenComparing(
                                ContestScore::getTotalSubmissions)
                        .thenComparing(
                                ContestScore::getUserId));

        int rank = 1;

        for (ContestScore score : scores) {

            score.setCurrentRank(rank);
            score.setUpdatedAt(LocalDateTime.now());

            rank++;
        }

        scoreRepository.saveAll(scores);
    }

    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Logged-in user not found"));
    }

    private ContestLeaderboardResponse mapToResponse(
            ContestScore score) {

        return ContestLeaderboardResponse.builder()
                .userId(score.getUserId())
                .totalScore(score.getTotalScore())
                .problemsSolved(score.getProblemsSolved())
                .totalSubmissions(score.getTotalSubmissions())
                .currentRank(score.getCurrentRank())
                .build();
    }
}