package com.coding.platform.contest.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coding.platform.contest.dto.ContestRequest;
import com.coding.platform.contest.dto.ContestResponse;
import com.coding.platform.contest.entity.Contest;
import com.coding.platform.contest.repository.ContestRepository;
import com.coding.platform.exception.ResourceNotFoundException;
import com.coding.platform.user.entity.User;
import com.coding.platform.user.repository.UserRepository;

@Service
@Transactional
public class ContestServiceImpl implements ContestService {

    private final ContestRepository contestRepository;
    private final UserRepository userRepository;

    public ContestServiceImpl(
            ContestRepository contestRepository,
            UserRepository userRepository) {

        this.contestRepository = contestRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ContestResponse createContest(ContestRequest request) {

        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new IllegalArgumentException(
                    "End time must be after start time"
            );
        }

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Logged-in user not found"
                        )
                );

        LocalDateTime now = LocalDateTime.now();

        Contest contest = Contest.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .createdBy(user.getId())
                .status("UPCOMING")
                .createdAt(now)
                .updatedAt(now)
                .build();

        Contest savedContest = contestRepository.save(contest);

        return mapToResponse(savedContest);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContestResponse> getAllContests() {

        return contestRepository.findAllByOrderByStartTimeAsc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ContestResponse getContestById(Long id) {

        Contest contest = contestRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Contest not found with id: " + id
                        )
                );

        return mapToResponse(contest);
    }

    @Override
    public ContestResponse updateContest(
            Long id,
            ContestRequest request) {

        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new IllegalArgumentException(
                    "End time must be after start time"
            );
        }

        Contest contest = contestRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Contest not found with id: " + id
                        )
                );

        contest.setTitle(request.getTitle());
        contest.setDescription(request.getDescription());
        contest.setStartTime(request.getStartTime());
        contest.setEndTime(request.getEndTime());
        contest.setUpdatedAt(LocalDateTime.now());

        Contest updatedContest = contestRepository.save(contest);

        return mapToResponse(updatedContest);
    }

    @Override
    public void deleteContest(Long id) {

        Contest contest = contestRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Contest not found with id: " + id
                        )
                );

        contestRepository.delete(contest);
    }

    private ContestResponse mapToResponse(Contest contest) {

        LocalDateTime now = LocalDateTime.now();

        String status;

        if (now.isBefore(contest.getStartTime())) {
            status = "UPCOMING";
        } else if (now.isBefore(contest.getEndTime())) {
            status = "RUNNING";
        } else {
            status = "ENDED";
        }

        return ContestResponse.builder()
                .id(contest.getId())
                .title(contest.getTitle())
                .description(contest.getDescription())
                .startTime(contest.getStartTime())
                .endTime(contest.getEndTime())
                .createdBy(contest.getCreatedBy())
                .status(status)
                .createdAt(contest.getCreatedAt())
                .updatedAt(contest.getUpdatedAt())
                .build();
    }
}