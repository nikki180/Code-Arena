package com.coding.platform.contestsubmission.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coding.platform.contest.entity.Contest;
import com.coding.platform.contest.repository.ContestRepository;
import com.coding.platform.contestproblem.entity.ContestProblem;
import com.coding.platform.contestproblem.repository.ContestProblemRepository;
import com.coding.platform.contestregistration.repository.ContestRegistrationRepository;
import com.coding.platform.contestscore.service.ContestScoreService;
import com.coding.platform.contestsubmission.dto.ContestSubmissionEvaluationRequest;
import com.coding.platform.contestsubmission.dto.ContestSubmissionRequest;
import com.coding.platform.contestsubmission.dto.ContestSubmissionResponse;
import com.coding.platform.contestsubmission.entity.ContestSubmission;
import com.coding.platform.contestsubmission.repository.ContestSubmissionRepository;
import com.coding.platform.exception.ResourceNotFoundException;
import com.coding.platform.user.entity.User;
import com.coding.platform.user.repository.UserRepository;

@Service
@Transactional
public class ContestSubmissionServiceImpl
        implements ContestSubmissionService {

    private final ContestSubmissionRepository submissionRepository;
    private final ContestRepository contestRepository;
    private final ContestProblemRepository contestProblemRepository;
    private final ContestRegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final ContestScoreService contestScoreService;

    public ContestSubmissionServiceImpl(
            ContestSubmissionRepository submissionRepository,
            ContestRepository contestRepository,
            ContestProblemRepository contestProblemRepository,
            ContestRegistrationRepository registrationRepository,
            UserRepository userRepository,
            ContestScoreService contestScoreService) {

        this.submissionRepository = submissionRepository;
        this.contestRepository = contestRepository;
        this.contestProblemRepository = contestProblemRepository;
        this.registrationRepository = registrationRepository;
        this.userRepository = userRepository;
        this.contestScoreService = contestScoreService;
    }

    @Override
    public ContestSubmissionResponse submitSolution(
            ContestSubmissionRequest request) {

        Contest contest = contestRepository.findById(request.getContestId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Contest not found with id: "
                                        + request.getContestId()));

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Logged-in user not found"));

        LocalDateTime now = LocalDateTime.now();

        if (now.isBefore(contest.getStartTime())) {
            throw new IllegalArgumentException(
                    "Contest has not started yet");
        }

        if (!now.isBefore(contest.getEndTime())) {
            throw new IllegalArgumentException(
                    "Contest has ended");
        }

        if (!registrationRepository.existsByContestIdAndUserId(
                contest.getId(),
                user.getId())) {

            throw new IllegalArgumentException(
                    "User is not registered for this contest");
        }

        ContestProblem contestProblem =
                contestProblemRepository
                        .findByContestIdOrderByProblemOrderAsc(
                                contest.getId())
                        .stream()
                        .filter(cp ->
                                cp.getProblemId()
                                        .equals(request.getProblemId()))
                        .findFirst()
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Problem is not part of this contest"));

        ContestSubmission submission =
                ContestSubmission.builder()
                        .contestId(contest.getId())
                        .userId(user.getId())
                        .problemId(contestProblem.getProblemId())
                        .language(request.getLanguage())
                        .sourceCode(request.getSourceCode())
                        .status("PENDING")
                        .score(0)
                        .submittedAt(now)
                        .build();

        ContestSubmission savedSubmission =
                submissionRepository.save(submission);

        return mapToResponse(savedSubmission);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContestSubmissionResponse> getMySubmissions(
            Long contestId) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Logged-in user not found"));

        contestRepository.findById(contestId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Contest not found with id: " + contestId));

        return submissionRepository
                .findByContestIdAndUserIdOrderBySubmittedAtDesc(
                        contestId,
                        user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContestSubmissionResponse> getContestSubmissions(
            Long contestId) {

        contestRepository.findById(contestId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Contest not found with id: " + contestId));

        return submissionRepository
                .findByContestIdOrderBySubmittedAtDesc(contestId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ContestSubmissionResponse evaluateSubmission(
            Long submissionId,
            ContestSubmissionEvaluationRequest request) {

        ContestSubmission submission =
                submissionRepository.findById(submissionId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Contest submission not found with id: "
                                                + submissionId));

        ContestProblem contestProblem =
                contestProblemRepository
                        .findByContestIdOrderByProblemOrderAsc(
                                submission.getContestId())
                        .stream()
                        .filter(cp ->
                                cp.getProblemId()
                                        .equals(submission.getProblemId()))
                        .findFirst()
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Problem is not part of this contest"));

        String status = request.getStatus().toUpperCase();

        if ("ACCEPTED".equals(status)) {
            submission.setScore(contestProblem.getPoints());
        } else {
            submission.setScore(0);
        }

        submission.setStatus(status);

        ContestSubmission updatedSubmission =
                submissionRepository.save(submission);

        // Recalculate contest score after evaluation
        contestScoreService.recalculateUserScore(
                submission.getContestId(),
                submission.getUserId());

        return mapToResponse(updatedSubmission);
    }

    private ContestSubmissionResponse mapToResponse(
            ContestSubmission submission) {

        return ContestSubmissionResponse.builder()
                .id(submission.getId())
                .contestId(submission.getContestId())
                .userId(submission.getUserId())
                .problemId(submission.getProblemId())
                .language(submission.getLanguage())
                .status(submission.getStatus())
                .score(submission.getScore())
                .submittedAt(submission.getSubmittedAt())
                .build();
    }
}