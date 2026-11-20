package com.coding.platform.dashboard.service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coding.platform.dashboard.dto.DashboardResponse;
import com.coding.platform.dashboard.dto.LanguageUsageResponse;
import com.coding.platform.dashboard.dto.RecentSubmissionResponse;
import com.coding.platform.dashboard.dto.SubmissionHeatmapResponse;
import com.coding.platform.dashboard.repository.DashboardRepository;
import com.coding.platform.dashboard.repository.DashboardSubmissionRepository;
import com.coding.platform.problem.entity.Problem;
import com.coding.platform.problem.repository.ProblemRepository;
import com.coding.platform.submission.entity.Submission;
import com.coding.platform.user.entity.User;
import com.coding.platform.user.repository.UserRepository;

@Service
@Transactional
public class DashboardServiceImpl implements DashboardService {

    private final DashboardRepository dashboardRepository;
    private final DashboardSubmissionRepository dashboardSubmissionRepository;
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;

    public DashboardServiceImpl(
            DashboardRepository dashboardRepository,
            DashboardSubmissionRepository dashboardSubmissionRepository,
            ProblemRepository problemRepository,
            UserRepository userRepository) {

        this.dashboardRepository = dashboardRepository;
        this.dashboardSubmissionRepository = dashboardSubmissionRepository;
        this.problemRepository = problemRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {

        // Get currently authenticated user from JWT/SecurityContext
        User user = getCurrentUser();

        Long userId = user.getId();

        // Get all submissions of the logged-in user
        List<Submission> submissions =
                dashboardSubmissionRepository
                        .findByUserIdOrderBySubmittedAtDesc(userId);

        // Latest 10 submissions
        List<Submission> recentSubmissions =
                submissions.stream()
                        .limit(10)
                        .toList();

        // Get problems related to recent submissions
        Map<Long, Problem> problems =
                problemRepository.findAllById(
                                recentSubmissions.stream()
                                        .map(Submission::getProblemId)
                                        .distinct()
                                        .toList()
                        )
                        .stream()
                        .collect(Collectors.toMap(
                                Problem::getId,
                                Function.identity()
                        ));

        return DashboardResponse.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .profileImage(user.getProfileImage())

                // Real values from User table
                .totalProblemSolved(user.getTotalProblemSolved())
                .totalSubmission(user.getTotalSubmission())
                .currentStreak(user.getCurrentStreak())
                .maxStreak(user.getMaxStreak())

                // Real submission data
                .recentSubmissions(
                        buildRecentSubmissions(
                                recentSubmissions,
                                problems
                        )
                )
                .languageUsage(
                        buildLanguageUsage(submissions)
                )
                .submissionHeatmap(
                        buildSubmissionHeatmap(submissions)
                )
                .build();
    }

    /**
     * Get currently logged-in user from JWT authentication.
     */
    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "Authenticated user not found"
            );
        }

        String email;

        Object principal =
                authentication.getPrincipal();

        if (principal instanceof UserDetails userDetails) {

            email = userDetails.getUsername();

        } else {

            email = authentication.getName();
        }

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with email: " + email
                        )
                );
    }

    private List<RecentSubmissionResponse> buildRecentSubmissions(
            List<Submission> submissions,
            Map<Long, Problem> problems) {

        return submissions.stream()
                .map(submission -> {

                    Problem problem =
                            problems.get(submission.getProblemId());

                    return RecentSubmissionResponse.builder()
                            .submissionId(submission.getId())
                            .problemId(submission.getProblemId())
                            .problemTitle(
                                    problem != null
                                            ? problem.getTitle()
                                            : "Unknown Problem"
                            )
                            .language(
                                    submission.getLanguage() != null
                                            ? submission.getLanguage().name()
                                            : null
                            )
                            .status(
                                    submission.getStatus() != null
                                            ? submission.getStatus().name()
                                            : null
                            )
                            .submittedAt(submission.getSubmittedAt())
                            .build();
                })
                .toList();
    }

    private List<LanguageUsageResponse> buildLanguageUsage(
            List<Submission> submissions) {

        if (submissions.isEmpty()) {
            return Collections.emptyList();
        }

        Map<String, List<Submission>> groupedByLanguage =
                submissions.stream()
                        .filter(submission ->
                                submission.getLanguage() != null)
                        .collect(Collectors.groupingBy(
                                submission ->
                                        submission.getLanguage().name()
                        ));

        return groupedByLanguage.entrySet()
                .stream()
                .map(entry -> {

                    List<Submission> languageSubmissions =
                            entry.getValue();

                    int acceptedCount =
                            (int) languageSubmissions.stream()
                                    .filter(submission ->
                                            submission.getStatus() != null &&
                                            submission.getStatus()
                                                    .name()
                                                    .equals("ACCEPTED"))
                                    .count();

                    return LanguageUsageResponse.builder()
                            .language(entry.getKey())
                            .submissionCount(
                                    languageSubmissions.size()
                            )
                            .acceptedCount(
                                    acceptedCount
                            )
                            .build();
                })
                .sorted((a, b) ->
                        Integer.compare(
                                b.getSubmissionCount(),
                                a.getSubmissionCount()
                        ))
                .toList();
    }

    private List<SubmissionHeatmapResponse> buildSubmissionHeatmap(
            List<Submission> submissions) {

        if (submissions.isEmpty()) {
            return Collections.emptyList();
        }

        Map<LocalDate, Long> submissionsByDate =
                submissions.stream()
                        .filter(submission ->
                                submission.getSubmittedAt() != null)
                        .collect(Collectors.groupingBy(
                                submission ->
                                        submission.getSubmittedAt()
                                                .toLocalDate(),
                                Collectors.counting()
                        ));

        return submissionsByDate.entrySet()
                .stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry ->
                        SubmissionHeatmapResponse.builder()
                                .date(entry.getKey())
                                .submissionCount(
                                        entry.getValue().intValue()
                                )
                                .build()
                )
                .toList();
    }
}