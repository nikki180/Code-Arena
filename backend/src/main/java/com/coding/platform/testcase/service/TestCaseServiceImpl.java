package com.coding.platform.testcase.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coding.platform.problem.entity.Problem;
import com.coding.platform.problem.repository.ProblemRepository;
import com.coding.platform.testcase.dto.TestCaseRequest;
import com.coding.platform.testcase.dto.TestCaseResponse;
import com.coding.platform.testcase.entity.TestCase;
import com.coding.platform.testcase.repository.TestCaseRepository;
import com.coding.platform.util.ApiResponse;

@Service
@Transactional
public class TestCaseServiceImpl implements TestCaseService {

    private final TestCaseRepository testCaseRepository;
    private final ProblemRepository problemRepository;

    public TestCaseServiceImpl(
            TestCaseRepository testCaseRepository,
            ProblemRepository problemRepository) {

        this.testCaseRepository = testCaseRepository;
        this.problemRepository = problemRepository;
    }

    // =========================================================
    // CREATE
    // =========================================================

    @Override
    public ApiResponse<TestCaseResponse> createTestCase(
            Long problemId,
            TestCaseRequest request) {

        Problem problem = problemRepository.findById(problemId)
                .orElse(null);

        if (problem == null ||
                !Boolean.TRUE.equals(problem.getIsActive())) {

            return new ApiResponse<>(
                    false,
                    "Problem not found with id: " + problemId,
                    null
            );
        }

        TestCase testCase = new TestCase();

        testCase.setProblem(problem);
        testCase.setInputData(request.getInputData());
        testCase.setExpectedOutput(request.getExpectedOutput());
        testCase.setIsSample(
                request.getIsSample() != null
                        ? request.getIsSample()
                        : false
        );
        testCase.setIsHidden(
                request.getIsHidden() != null
                        ? request.getIsHidden()
                        : true
        );
        testCase.setCreatedAt(LocalDateTime.now());

        TestCase savedTestCase =
                testCaseRepository.save(testCase);

        return new ApiResponse<>(
                true,
                "Test case created successfully",
                mapToResponse(savedTestCase)
        );
    }

    // =========================================================
    // GET ALL TEST CASES FOR A PROBLEM
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<TestCaseResponse>> getTestCasesByProblem(
            Long problemId) {

        Problem problem = problemRepository.findById(problemId)
                .orElse(null);

        if (problem == null) {

            return new ApiResponse<>(
                    false,
                    "Problem not found with id: " + problemId,
                    null
            );
        }

        List<TestCaseResponse> testCases =
                testCaseRepository
                        .findByProblemIdOrderByIdAsc(problemId)
                        .stream()
                        .filter(testCase ->
                                Boolean.TRUE.equals(testCase.getIsSample()) ||
                                Boolean.FALSE.equals(testCase.getIsHidden()))
                        .map(this::mapToResponse)
                        .toList();

        // Older problems may only have sample input/output on the problem row.
        if (testCases.isEmpty()
                && problem.getSampleInput() != null
                && problem.getSampleOutput() != null) {
            TestCaseResponse sample = new TestCaseResponse();
            sample.setProblemId(problem.getId());
            sample.setInputData(problem.getSampleInput());
            sample.setExpectedOutput(problem.getSampleOutput());
            sample.setIsSample(true);
            sample.setIsHidden(false);
            testCases = List.of(sample);
        }

        return new ApiResponse<>(
                true,
                "Test cases fetched successfully",
                testCases
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<TestCaseResponse>> getAllTestCasesByProblem(
            Long problemId) {
        if (!problemRepository.existsById(problemId)) {
            return new ApiResponse<>(false,
                    "Problem not found with id: " + problemId, null);
        }
        List<TestCaseResponse> testCases = testCaseRepository
                .findByProblemIdOrderByIdAsc(problemId)
                .stream()
                .map(this::mapToResponse)
                .toList();
        return new ApiResponse<>(true, "All test cases fetched successfully", testCases);
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<TestCaseResponse> getTestCaseById(
            Long id) {

        TestCase testCase =
                testCaseRepository.findById(id)
                        .orElse(null);

        if (testCase == null) {

            return new ApiResponse<>(
                    false,
                    "Test case not found with id: " + id,
                    null
            );
        }

        return new ApiResponse<>(
                true,
                "Test case fetched successfully",
                mapToResponse(testCase)
        );
    }

    // =========================================================
    // UPDATE
    // =========================================================

    @Override
    public ApiResponse<TestCaseResponse> updateTestCase(
            Long id,
            TestCaseRequest request) {

        TestCase testCase =
                testCaseRepository.findById(id)
                        .orElse(null);

        if (testCase == null) {

            return new ApiResponse<>(
                    false,
                    "Test case not found with id: " + id,
                    null
            );
        }

        testCase.setInputData(request.getInputData());
        testCase.setExpectedOutput(request.getExpectedOutput());

        if (request.getIsSample() != null) {
            testCase.setIsSample(request.getIsSample());
        }

        if (request.getIsHidden() != null) {
            testCase.setIsHidden(request.getIsHidden());
        }

        TestCase updatedTestCase =
                testCaseRepository.save(testCase);

        return new ApiResponse<>(
                true,
                "Test case updated successfully",
                mapToResponse(updatedTestCase)
        );
    }

    // =========================================================
    // DELETE
    // =========================================================

    @Override
    public ApiResponse<String> deleteTestCase(Long id) {

        TestCase testCase =
                testCaseRepository.findById(id)
                        .orElse(null);

        if (testCase == null) {

            return new ApiResponse<>(
                    false,
                    "Test case not found with id: " + id,
                    null
            );
        }

        testCaseRepository.delete(testCase);

        return new ApiResponse<>(
                true,
                "Test case deleted successfully",
                "Test case with id " + id + " has been deleted"
        );
    }

    // =========================================================
    // ENTITY → RESPONSE
    // =========================================================

    private TestCaseResponse mapToResponse(
            TestCase testCase) {

        TestCaseResponse response =
                new TestCaseResponse();

        response.setId(testCase.getId());

        response.setProblemId(
                testCase.getProblem().getId()
        );

        response.setInputData(
                testCase.getInputData()
        );

        response.setExpectedOutput(
                testCase.getExpectedOutput()
        );

        response.setIsSample(
                testCase.getIsSample()
        );

        response.setIsHidden(
                testCase.getIsHidden()
        );

        response.setCreatedAt(
                testCase.getCreatedAt()
        );

        return response;
    }
}
