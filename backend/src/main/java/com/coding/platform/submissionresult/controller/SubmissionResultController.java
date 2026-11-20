package com.coding.platform.submissionresult.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coding.platform.submissionresult.dto.SubmissionResultResponse;
import com.coding.platform.submissionresult.service.SubmissionResultService;

@RestController
@RequestMapping("/api/submission-results")
public class SubmissionResultController {

    private final SubmissionResultService submissionResultService;

    public SubmissionResultController(
            SubmissionResultService submissionResultService) {

        this.submissionResultService =
                submissionResultService;
    }

    // =========================================================
    // GET ALL RESULTS
    // ADMIN ONLY
    // =========================================================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<SubmissionResultResponse> getAllResults() {

        return submissionResultService.getAllResults();
    }

    // =========================================================
    // GET RESULT BY SUBMISSION ID
    // USER + ADMIN
    // =========================================================

    @GetMapping("/submission/{submissionId}")
    public SubmissionResultResponse getBySubmissionId(
            @PathVariable Long submissionId) {

        return submissionResultService
                .getBySubmissionId(submissionId);
    }
}