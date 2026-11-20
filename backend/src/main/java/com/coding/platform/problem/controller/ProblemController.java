package com.coding.platform.problem.controller;

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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.coding.platform.problem.dto.ProblemRequest;
import com.coding.platform.problem.dto.ProblemResponse;
import com.coding.platform.problem.service.ProblemService;
import com.coding.platform.util.ApiResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    private final ProblemService problemService;

    public ProblemController(
            ProblemService problemService) {

        this.problemService = problemService;
    }


    // =========================================================
    // GET ALL
    // USER + ADMIN
    // =========================================================

    @GetMapping
    public ApiResponse<List<ProblemResponse>> getAllProblems() {

        return problemService.getAllProblems();
    }


    // =========================================================
    // GET BY ID
    // USER + ADMIN
    // =========================================================

    @GetMapping("/{id}")
    public ApiResponse<ProblemResponse> getProblemById(
            @PathVariable Long id) {

        return problemService.getProblemById(id);
    }


    // =========================================================
    // CREATE
    // ADMIN ONLY
    // =========================================================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ProblemResponse> createProblem(
            @Valid @RequestBody ProblemRequest request) {

        return problemService.createProblem(request);
    }


    // =========================================================
    // UPDATE
    // ADMIN ONLY
    // =========================================================

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ProblemResponse> updateProblem(
            @PathVariable Long id,
            @Valid @RequestBody ProblemRequest request) {

        return problemService.updateProblem(
                id,
                request
        );
    }


    // =========================================================
    // DELETE
    // ADMIN ONLY
    // =========================================================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<String> deleteProblem(
            @PathVariable Long id) {

        return problemService.deleteProblem(id);
    }
}