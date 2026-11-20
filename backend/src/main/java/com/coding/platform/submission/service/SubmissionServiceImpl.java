package com.coding.platform.submission.service;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coding.platform.judge.dto.JudgeResult;
import com.coding.platform.judge.service.JudgeService;
import com.coding.platform.leaderboard.entity.LeaderboardEntry;
import com.coding.platform.leaderboard.repository.LeaderboardRepository;
import com.coding.platform.problem.entity.Problem;
import com.coding.platform.problem.repository.ProblemRepository;
import com.coding.platform.submission.dto.SubmissionRequest;
import com.coding.platform.submission.dto.SubmissionResponse;
import com.coding.platform.submission.entity.Submission;
import com.coding.platform.submission.entity.SubmissionStatus;
import com.coding.platform.submission.repository.SubmissionRepository;
import com.coding.platform.user.entity.User;
import com.coding.platform.user.repository.UserRepository;
import com.coding.platform.util.ApiResponse;

@Service
@Transactional
public class SubmissionServiceImpl implements SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final JudgeService judgeService;
    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final LeaderboardRepository leaderboardRepository;

    public SubmissionServiceImpl(
            SubmissionRepository submissionRepository,
            JudgeService judgeService,
            UserRepository userRepository,
            ProblemRepository problemRepository,
            LeaderboardRepository leaderboardRepository) {

        this.submissionRepository = submissionRepository;
        this.judgeService = judgeService;
        this.userRepository = userRepository;
        this.problemRepository = problemRepository;
        this.leaderboardRepository = leaderboardRepository;
    }

    // =========================================================
    // CREATE SUBMISSION
    // =========================================================

    @Override
    public ApiResponse<SubmissionResponse> createSubmission(
            SubmissionRequest request) {

        User user = getAuthenticatedUser();
        if (user == null || !user.getId().equals(request.getUserId())) {
            return new ApiResponse<>(false,
                    "The submission user does not match the signed-in account.", null);
        }

        Submission submission = new Submission();

        submission.setUserId(request.getUserId());
        submission.setProblemId(request.getProblemId());
        submission.setLanguage(request.getLanguage());
        submission.setSourceCode(request.getSourceCode());

        submission.setStatus(SubmissionStatus.RUNNING);
        submission.setSubmittedAt(LocalDateTime.now());

        Submission savedSubmission = submissionRepository.save(submission);

        JudgeResult result;
        String responseMessage = "Submission created successfully";
        try {
            result = judgeService.judge(
                    request.getProblemId(),
                    request.getLanguage(),
                    request.getSourceCode());
            savedSubmission.setStatus(toSubmissionStatus(result.getStatus()));
            responseMessage = (result.getMessage() == null ? "Submission evaluated." : result.getMessage())
                    + " (" + result.getPassedTestCases() + "/" + result.getTotalTestCases()
                    + " test cases passed)";
        } catch (RuntimeException exception) {
            savedSubmission.setStatus(SubmissionStatus.RUNTIME_ERROR);
            responseMessage = exception.getMessage() == null
                    ? "Code execution failed."
                    : exception.getMessage();
        }

        savedSubmission = submissionRepository.save(savedSubmission);
        updateUserAndLeaderboard(user, savedSubmission);

        return new ApiResponse<>(
                true,
                responseMessage,
                mapToResponse(savedSubmission)
        );
    }

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        Object principal = authentication.getPrincipal();
        String email = principal instanceof UserDetails details
                ? details.getUsername() : authentication.getName();
        return userRepository.findByEmail(email).orElse(null);
    }

    private boolean canReadUserData(Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) return false;
        boolean admin = authentication.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
        if (admin) return true;
        User currentUser = getAuthenticatedUser();
        return currentUser != null && currentUser.getId().equals(userId);
    }

    private SubmissionStatus toSubmissionStatus(String status) {
        if (status == null) return SubmissionStatus.RUNTIME_ERROR;
        try {
            return SubmissionStatus.valueOf(status);
        } catch (IllegalArgumentException exception) {
            return SubmissionStatus.RUNTIME_ERROR;
        }
    }

    private void updateUserAndLeaderboard(User user, Submission submission) {
        LocalDate today = submission.getSubmittedAt().toLocalDate();
        LeaderboardEntry entry = leaderboardRepository.findByUserId(user.getId())
                .orElseGet(() -> LeaderboardEntry.builder()
                        .userId(user.getId())
                        .totalScore(0)
                        .totalProblemsSolved(0)
                        .totalSubmissions(0)
                        .currentRank(1)
                        .build());

        LocalDate previousSubmissionDay = entry.getLastSubmissionAt() == null
                ? null : entry.getLastSubmissionAt().toLocalDate();
        int currentStreak = user.getCurrentStreak() == null ? 0 : user.getCurrentStreak();
        if (previousSubmissionDay == null || previousSubmissionDay.isBefore(today.minusDays(1))) {
            currentStreak = 1;
        } else if (previousSubmissionDay.isBefore(today)) {
            currentStreak++;
        }
        user.setCurrentStreak(currentStreak);
        user.setMaxStreak(Math.max(user.getMaxStreak() == null ? 0 : user.getMaxStreak(), currentStreak));
        user.setTotalSubmission((user.getTotalSubmission() == null ? 0 : user.getTotalSubmission()) + 1);
        user.setUpdatedAt(LocalDateTime.now());

        entry.setTotalSubmissions(entry.getTotalSubmissions() + 1);
        entry.setLastSubmissionAt(submission.getSubmittedAt());
        entry.setUpdatedAt(LocalDateTime.now());

        if (submission.getStatus() == SubmissionStatus.ACCEPTED) {
            boolean alreadySolved = submissionRepository
                    .findByUserIdAndProblemIdOrderBySubmittedAtDesc(
                            user.getId(), submission.getProblemId())
                    .stream()
                    .anyMatch(previous -> !previous.getId().equals(submission.getId()) &&
                            previous.getStatus() == SubmissionStatus.ACCEPTED);
            if (!alreadySolved) {
                user.setTotalProblemSolved((user.getTotalProblemSolved() == null ? 0 : user.getTotalProblemSolved()) + 1);
                entry.setTotalProblemsSolved(entry.getTotalProblemsSolved() + 1);
                Problem problem = problemRepository.findById(submission.getProblemId()).orElse(null);
                if (problem != null && problem.getPoints() != null) {
                    entry.setTotalScore(entry.getTotalScore() + problem.getPoints());
                }
            }
        }

        userRepository.save(user);
        leaderboardRepository.save(entry);
        List<LeaderboardEntry> rankings = leaderboardRepository.findAll(
                Sort.by(Sort.Order.desc("totalScore"),
                        Sort.Order.desc("totalProblemsSolved"),
                        Sort.Order.asc("lastSubmissionAt")));
        for (int index = 0; index < rankings.size(); index++) {
            rankings.get(index).setCurrentRank(index + 1);
        }
        leaderboardRepository.saveAll(rankings);
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<SubmissionResponse> getSubmissionById(
            Long id) {

        Submission submission =
                submissionRepository.findById(id)
                        .orElse(null);

        if (submission == null) {

            return new ApiResponse<>(
                    false,
                    "Submission not found with id: " + id,
                    null
            );
        }

        if (!canReadUserData(submission.getUserId())) {
            return new ApiResponse<>(false, "You are not allowed to view this submission.", null);
        }

        return new ApiResponse<>(
                true,
                "Submission fetched successfully",
                mapToResponse(submission)
        );
    }

    // =========================================================
    // GET ALL
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<SubmissionResponse>> getAllSubmissions() {

        List<SubmissionResponse> submissions =
                submissionRepository.findAll()
                        .stream()
                        .map(this::mapToResponse)
                        .toList();

        return new ApiResponse<>(
                true,
                "Submissions fetched successfully",
                submissions
        );
    }

    // =========================================================
    // GET BY USER
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<SubmissionResponse>> getSubmissionsByUser(
            Long userId) {

        if (!canReadUserData(userId)) {
            return new ApiResponse<>(false, "You are not allowed to view these submissions.", null);
        }

        List<SubmissionResponse> submissions =
                submissionRepository
                        .findByUserIdOrderBySubmittedAtDesc(userId)
                        .stream()
                        .map(this::mapToResponse)
                        .toList();

        return new ApiResponse<>(
                true,
                "User submissions fetched successfully",
                submissions
        );
    }

    // =========================================================
    // GET BY PROBLEM
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<SubmissionResponse>> getSubmissionsByProblem(
            Long problemId) {

        List<SubmissionResponse> submissions =
                submissionRepository
                        .findByProblemIdOrderBySubmittedAtDesc(problemId)
                        .stream()
                        .map(this::mapToResponse)
                        .toList();

        return new ApiResponse<>(
                true,
                "Problem submissions fetched successfully",
                submissions
        );
    }

    // =========================================================
    // UPDATE STATUS
    // =========================================================

    @Override
    public ApiResponse<SubmissionResponse> updateSubmissionStatus(
            Long id,
            String status) {

        Submission submission =
                submissionRepository.findById(id)
                        .orElse(null);

        if (submission == null) {

            return new ApiResponse<>(
                    false,
                    "Submission not found with id: " + id,
                    null
            );
        }

        SubmissionStatus submissionStatus;

        try {

            submissionStatus =
                    SubmissionStatus.valueOf(
                            status.toUpperCase()
                    );

        } catch (IllegalArgumentException e) {

            return new ApiResponse<>(
                    false,
                    "Invalid submission status: " + status,
                    null
            );
        }

        submission.setStatus(submissionStatus);

        Submission updatedSubmission =
                submissionRepository.save(submission);

        return new ApiResponse<>(
                true,
                "Submission status updated successfully",
                mapToResponse(updatedSubmission)
        );
    }

    // =========================================================
    // DELETE
    // =========================================================

    @Override
    public ApiResponse<String> deleteSubmission(Long id) {

        Submission submission =
                submissionRepository.findById(id)
                        .orElse(null);

        if (submission == null) {

            return new ApiResponse<>(
                    false,
                    "Submission not found with id: " + id,
                    null
            );
        }

        submissionRepository.delete(submission);

        return new ApiResponse<>(
                true,
                "Submission deleted successfully",
                "Submission with id " + id + " has been deleted"
        );
    }

    // =========================================================
    // ENTITY → RESPONSE
    // =========================================================

    private SubmissionResponse mapToResponse(
            Submission submission) {

        return SubmissionResponse.builder()
                .id(submission.getId())
                .userId(submission.getUserId())
                .problemId(submission.getProblemId())
                .language(submission.getLanguage())
                .sourceCode(submission.getSourceCode())
                .status(submission.getStatus())
                .submittedAt(submission.getSubmittedAt())
                .build();
    }
}
