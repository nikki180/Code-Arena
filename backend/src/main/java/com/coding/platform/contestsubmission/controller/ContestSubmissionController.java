package com.coding.platform.contestsubmission.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.coding.platform.contestsubmission.dto.ContestSubmissionEvaluationRequest;
import com.coding.platform.contestsubmission.dto.ContestSubmissionRequest;
import com.coding.platform.contestsubmission.dto.ContestSubmissionResponse;
import com.coding.platform.contestsubmission.service.ContestSubmissionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/contest-submissions")
public class ContestSubmissionController {

    private final ContestSubmissionService submissionService;

    public ContestSubmissionController(
            ContestSubmissionService submissionService) {

        this.submissionService = submissionService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContestSubmissionResponse submitSolution(
            @Valid @RequestBody ContestSubmissionRequest request) {

        return submissionService.submitSolution(request);
    }

    @GetMapping("/my/{contestId}")
    public List<ContestSubmissionResponse> getMySubmissions(
            @PathVariable Long contestId) {

        return submissionService.getMySubmissions(contestId);
    }

    @GetMapping("/contest/{contestId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ContestSubmissionResponse> getContestSubmissions(
            @PathVariable Long contestId) {

        return submissionService.getContestSubmissions(contestId);
    }

    @PutMapping("/{submissionId}/evaluate")
    @PreAuthorize("hasRole('ADMIN')")
    public ContestSubmissionResponse evaluateSubmission(
            @PathVariable Long submissionId,
            @Valid @RequestBody ContestSubmissionEvaluationRequest request) {

        return submissionService.evaluateSubmission(
                submissionId,
                request);
    }
}