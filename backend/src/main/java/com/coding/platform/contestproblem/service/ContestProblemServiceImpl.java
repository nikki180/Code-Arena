package com.coding.platform.contestproblem.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coding.platform.contest.entity.Contest;
import com.coding.platform.contest.repository.ContestRepository;
import com.coding.platform.contestproblem.dto.ContestProblemRequest;
import com.coding.platform.contestproblem.dto.ContestProblemResponse;
import com.coding.platform.contestproblem.entity.ContestProblem;
import com.coding.platform.contestproblem.repository.ContestProblemRepository;
import com.coding.platform.exception.DuplicateResourceException;
import com.coding.platform.exception.ResourceNotFoundException;
import com.coding.platform.problem.entity.Problem;
import com.coding.platform.problem.repository.ProblemRepository;

@Service
@Transactional
public class ContestProblemServiceImpl implements ContestProblemService {

    private final ContestProblemRepository contestProblemRepository;
    private final ContestRepository contestRepository;
    private final ProblemRepository problemRepository;

    public ContestProblemServiceImpl(
            ContestProblemRepository contestProblemRepository,
            ContestRepository contestRepository,
            ProblemRepository problemRepository) {

        this.contestProblemRepository = contestProblemRepository;
        this.contestRepository = contestRepository;
        this.problemRepository = problemRepository;
    }

    @Override
    public ContestProblemResponse addProblemToContest(
            ContestProblemRequest request) {

        Contest contest = contestRepository.findById(request.getContestId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Contest not found with id: "
                                        + request.getContestId()));

        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Problem not found with id: "
                                        + request.getProblemId()));

        if (contestProblemRepository.existsByContestIdAndProblemId(
                request.getContestId(),
                request.getProblemId())) {

            throw new DuplicateResourceException(
                    "Problem is already added to this contest");
        }

        ContestProblem contestProblem = ContestProblem.builder()
                .contestId(contest.getId())
                .problemId(problem.getId())
                .problemOrder(request.getProblemOrder())
                .points(request.getPoints())
                .build();

        ContestProblem savedContestProblem =
                contestProblemRepository.save(contestProblem);

        return mapToResponse(savedContestProblem);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContestProblemResponse> getProblemsByContestId(
            Long contestId) {

        contestRepository.findById(contestId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Contest not found with id: " + contestId));

        return contestProblemRepository
                .findByContestIdOrderByProblemOrderAsc(contestId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private ContestProblemResponse mapToResponse(
            ContestProblem contestProblem) {

        return ContestProblemResponse.builder()
                .id(contestProblem.getId())
                .contestId(contestProblem.getContestId())
                .problemId(contestProblem.getProblemId())
                .problemOrder(contestProblem.getProblemOrder())
                .points(contestProblem.getPoints())
                .build();
    }
}