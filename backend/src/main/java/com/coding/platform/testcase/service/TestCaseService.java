package com.coding.platform.testcase.service;

import java.util.List;

import com.coding.platform.testcase.dto.TestCaseRequest;
import com.coding.platform.testcase.dto.TestCaseResponse;
import com.coding.platform.util.ApiResponse;

public interface TestCaseService {

    ApiResponse<TestCaseResponse> createTestCase(
            Long problemId,
            TestCaseRequest request
    );

    ApiResponse<List<TestCaseResponse>> getTestCasesByProblem(
            Long problemId
    );

    ApiResponse<List<TestCaseResponse>> getAllTestCasesByProblem(
            Long problemId
    );

    ApiResponse<TestCaseResponse> getTestCaseById(
            Long id
    );

    ApiResponse<TestCaseResponse> updateTestCase(
            Long id,
            TestCaseRequest request
    );

    ApiResponse<String> deleteTestCase(
            Long id
    );
}
