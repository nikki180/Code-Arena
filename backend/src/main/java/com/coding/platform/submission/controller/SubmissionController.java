package com.coding.platform.submission.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.coding.platform.submission.dto.SubmissionRequest;
import com.coding.platform.submission.dto.SubmissionResponse;
import com.coding.platform.submission.service.SubmissionService;
import com.coding.platform.util.ApiResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    private final SubmissionService submissionService;

    public SubmissionController(
            SubmissionService submissionService) {

        this.submissionService = submissionService;
    }

    // =========================================================
    // CREATE SUBMISSION
    // USER + ADMIN
    // =========================================================

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<SubmissionResponse> createSubmission(
            @Valid @RequestBody SubmissionRequest request) {

        return submissionService.createSubmission(request);
    }

    // =========================================================
    // GET ALL SUBMISSIONS
    // ADMIN ONLY
    // =========================================================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<SubmissionResponse>> getAllSubmissions() {

        return submissionService.getAllSubmissions();
    }

    // =========================================================
    // GET SUBMISSION BY ID
    // USER + ADMIN
    // =========================================================

    @GetMapping("/{id}")
    public ApiResponse<SubmissionResponse> getSubmissionById(
            @PathVariable Long id) {

        return submissionService.getSubmissionById(id);
    }

    // =========================================================
    // GET USER SUBMISSIONS
    // USER + ADMIN
    // =========================================================

    @GetMapping("/user/{userId}")
    public ApiResponse<List<SubmissionResponse>> getSubmissionsByUser(
            @PathVariable Long userId) {

        return submissionService.getSubmissionsByUser(userId);
    }

    // =========================================================
    // GET PROBLEM SUBMISSIONS
    // ADMIN ONLY
    // =========================================================

    @GetMapping("/problem/{problemId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<SubmissionResponse>> getSubmissionsByProblem(
            @PathVariable Long problemId) {

        return submissionService.getSubmissionsByProblem(problemId);
    }

    // =========================================================
    // UPDATE STATUS
    // ADMIN ONLY
    // =========================================================

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<SubmissionResponse> updateSubmissionStatus(
            @PathVariable Long id,
            @RequestBody String status) {

        return submissionService.updateSubmissionStatus(
                id,
                status.replace("\"", "")
        );
    }

    // =========================================================
    // DELETE
    // ADMIN ONLY
    // =========================================================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<String> deleteSubmission(
            @PathVariable Long id) {

        return submissionService.deleteSubmission(id);
    }
}