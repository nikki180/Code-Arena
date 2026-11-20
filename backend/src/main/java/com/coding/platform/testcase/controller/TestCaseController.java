package com.coding.platform.testcase.controller;

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

import com.coding.platform.testcase.dto.TestCaseRequest;
import com.coding.platform.testcase.dto.TestCaseResponse;
import com.coding.platform.testcase.service.TestCaseService;
import com.coding.platform.util.ApiResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class TestCaseController {

    private final TestCaseService testCaseService;

    public TestCaseController(
            TestCaseService testCaseService) {

        this.testCaseService = testCaseService;
    }

    // =========================================================
    // GET ALL TEST CASES FOR A PROBLEM
    // USER + ADMIN
    // =========================================================

    @GetMapping("/problems/{problemId}/test-cases")
    public ApiResponse<List<TestCaseResponse>> getTestCasesByProblem(
            @PathVariable Long problemId) {

        return testCaseService.getTestCasesByProblem(problemId);
    }

    @GetMapping("/admin/problems/{problemId}/test-cases")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<TestCaseResponse>> getAllTestCasesByProblem(
            @PathVariable Long problemId) {
        return testCaseService.getAllTestCasesByProblem(problemId);
    }

    // =========================================================
    // GET TEST CASE BY ID
    // USER + ADMIN
    // =========================================================

    @GetMapping("/test-cases/{id}")
    public ApiResponse<TestCaseResponse> getTestCaseById(
            @PathVariable Long id) {

        return testCaseService.getTestCaseById(id);
    }

    // =========================================================
    // CREATE TEST CASE
    // ADMIN ONLY
    // =========================================================

    @PostMapping("/problems/{problemId}/test-cases")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<TestCaseResponse> createTestCase(
            @PathVariable Long problemId,
            @Valid @RequestBody TestCaseRequest request) {

        return testCaseService.createTestCase(
                problemId,
                request
        );
    }

    // =========================================================
    // UPDATE TEST CASE
    // ADMIN ONLY
    // =========================================================

    @PutMapping("/test-cases/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<TestCaseResponse> updateTestCase(
            @PathVariable Long id,
            @Valid @RequestBody TestCaseRequest request) {

        return testCaseService.updateTestCase(
                id,
                request
        );
    }

    // =========================================================
    // DELETE TEST CASE
    // ADMIN ONLY
    // =========================================================

    @DeleteMapping("/test-cases/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<String> deleteTestCase(
            @PathVariable Long id) {

        return testCaseService.deleteTestCase(id);
    }
}
