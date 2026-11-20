package com.coding.platform.contestregistration.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coding.platform.contest.entity.Contest;
import com.coding.platform.contest.repository.ContestRepository;
import com.coding.platform.contestregistration.dto.ContestRegistrationResponse;
import com.coding.platform.contestregistration.entity.ContestRegistration;
import com.coding.platform.contestregistration.repository.ContestRegistrationRepository;
import com.coding.platform.contestscore.entity.ContestScore;
import com.coding.platform.contestscore.repository.ContestScoreRepository;
import com.coding.platform.exception.DuplicateResourceException;
import com.coding.platform.exception.ResourceNotFoundException;
import com.coding.platform.user.entity.User;
import com.coding.platform.user.repository.UserRepository;

@Service
@Transactional
public class ContestRegistrationServiceImpl
        implements ContestRegistrationService {

    private final ContestRegistrationRepository registrationRepository;
    private final ContestRepository contestRepository;
    private final UserRepository userRepository;
    private final ContestScoreRepository scoreRepository;

    public ContestRegistrationServiceImpl(
            ContestRegistrationRepository registrationRepository,
            ContestRepository contestRepository,
            UserRepository userRepository,
            ContestScoreRepository scoreRepository) {

        this.registrationRepository = registrationRepository;
        this.contestRepository = contestRepository;
        this.userRepository = userRepository;
        this.scoreRepository = scoreRepository;
    }

    @Override
    public ContestRegistrationResponse registerForContest(
            Long contestId) {

        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Contest not found with id: " + contestId));

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Logged-in user not found"));

        if (registrationRepository.existsByContestIdAndUserId(
                contest.getId(),
                user.getId())) {

            throw new DuplicateResourceException(
                    "User is already registered for this contest");
        }

        ContestRegistration registration =
                ContestRegistration.builder()
                        .contestId(contest.getId())
                        .userId(user.getId())
                        .registeredAt(LocalDateTime.now())
                        .status("REGISTERED")
                        .build();

        ContestRegistration savedRegistration =
                registrationRepository.save(registration);

        // Create initial contest score for the registered user
        ContestScore score = ContestScore.builder()
                .contestId(contest.getId())
                .userId(user.getId())
                .totalScore(0)
                .problemsSolved(0)
                .totalSubmissions(0)
                .currentRank(0)
                .updatedAt(LocalDateTime.now())
                .build();

        scoreRepository.save(score);

        return mapToResponse(savedRegistration);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContestRegistrationResponse> getRegistrationsByContest(
            Long contestId) {

        contestRepository.findById(contestId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Contest not found with id: " + contestId));

        return registrationRepository
                .findByContestIdOrderByRegisteredAtAsc(contestId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContestRegistrationResponse> getMyRegistrations() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Logged-in user not found"));

        return registrationRepository
                .findByUserIdOrderByRegisteredAtDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private ContestRegistrationResponse mapToResponse(
            ContestRegistration registration) {

        return ContestRegistrationResponse.builder()
                .id(registration.getId())
                .contestId(registration.getContestId())
                .userId(registration.getUserId())
                .registeredAt(registration.getRegisteredAt())
                .status(registration.getStatus())
                .build();
    }
}