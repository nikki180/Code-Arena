package com.coding.platform.contestproblem.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.coding.platform.contestproblem.dto.ContestProblemRequest;
import com.coding.platform.contestproblem.dto.ContestProblemResponse;
import com.coding.platform.contestproblem.service.ContestProblemService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/contest-problems")
public class ContestProblemController {

    private final ContestProblemService contestProblemService;

    public ContestProblemController(
            ContestProblemService contestProblemService) {
        this.contestProblemService = contestProblemService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ContestProblemResponse addProblemToContest(
            @Valid @RequestBody ContestProblemRequest request) {

        return contestProblemService.addProblemToContest(request);
    }

    @GetMapping("/contest/{contestId}")
    public List<ContestProblemResponse> getProblemsByContestId(
            @PathVariable Long contestId) {

        return contestProblemService
                .getProblemsByContestId(contestId);
    }
}