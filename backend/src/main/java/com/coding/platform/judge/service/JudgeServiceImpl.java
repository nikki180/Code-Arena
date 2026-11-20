package com.coding.platform.judge.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.coding.platform.execution.dto.ExecutionResult;
import com.coding.platform.execution.service.CodeExecutionService;
import com.coding.platform.judge.dto.JudgeResult;
import com.coding.platform.judge.dto.TestCaseResult;
import com.coding.platform.problem.entity.Problem;
import com.coding.platform.problem.repository.ProblemRepository;
import com.coding.platform.submission.entity.ProgrammingLanguage;
import com.coding.platform.testcase.entity.TestCase;
import com.coding.platform.testcase.repository.TestCaseRepository;

@Service
public class JudgeServiceImpl implements JudgeService {

    private final TestCaseRepository testCaseRepository;
    private final CodeExecutionService codeExecutionService;
    private final ProblemRepository problemRepository;

    public JudgeServiceImpl(
            TestCaseRepository testCaseRepository,
            CodeExecutionService codeExecutionService,
            ProblemRepository problemRepository) {

        this.testCaseRepository = testCaseRepository;
        this.codeExecutionService = codeExecutionService;
        this.problemRepository = problemRepository;
    }

    @Override
    public JudgeResult judge(
            Long problemId,
            ProgrammingLanguage language,
            String sourceCode) {

        List<TestCase> testCases =
                testCaseRepository
                        .findByProblemIdOrderByIdAsc(problemId);

        Problem problem = problemRepository.findById(problemId).orElse(null);
        if (testCases.isEmpty() && problem != null
                && problem.getSampleInput() != null
                && problem.getSampleOutput() != null) {
            TestCase sample = new TestCase();
            sample.setProblem(problem);
            sample.setInputData(problem.getSampleInput());
            sample.setExpectedOutput(problem.getSampleOutput());
            sample.setIsSample(true);
            sample.setIsHidden(false);
            testCases = List.of(sample);
        }

        if (testCases.isEmpty()) {

            return JudgeResult.builder()
                    .accepted(false)
                    .status("NO_TEST_CASES")
                    .message("No test cases found for this problem.")
                    .totalTestCases(0)
                    .passedTestCases(0)
                    .executionTime(0L)
                    .testCaseResults(new ArrayList<>())
                    .build();
        }

        if (sourceCode == null ||
                sourceCode.trim().isEmpty()) {

            return JudgeResult.builder()
                    .accepted(false)
                    .status("EMPTY_CODE")
                    .message("Source code cannot be empty.")
                    .totalTestCases(testCases.size())
                    .passedTestCases(0)
                    .executionTime(0L)
                    .testCaseResults(new ArrayList<>())
                    .build();
        }

        if (language == null) {

            return JudgeResult.builder()
                    .accepted(false)
                    .status("INVALID_LANGUAGE")
                    .message("Programming language is required.")
                    .totalTestCases(testCases.size())
                    .passedTestCases(0)
                    .executionTime(0L)
                    .testCaseResults(new ArrayList<>())
                    .build();
        }

        List<TestCaseResult> results =
                new ArrayList<>();
        long totalExecutionTime = 0;
        int passed = 0;
        String finalStatus = "ACCEPTED";
        String finalError = null;

        for (int i = 0; i < testCases.size(); i++) {

            TestCase testCase = testCases.get(i);

            ExecutionResult execution = codeExecutionService.execute(
                    language.name(),
                    sourceCode,
                    testCase.getInputData(),
                    testCase.getExpectedOutput()
            );
            totalExecutionTime += execution.getExecutionTime() == null
                    ? 0L : execution.getExecutionTime();
            boolean testPassed = execution.isSuccess();
            if (testPassed) {
                passed++;
            } else if ("COMPILATION_ERROR".equals(execution.getStatus()) ||
                    "RUNTIME_ERROR".equals(execution.getStatus()) ||
                    "EXECUTION_ERROR".equals(execution.getStatus())) {
                finalStatus = execution.getStatus();
                finalError = execution.getErrorMessage();
            } else {
                finalStatus = "WRONG_ANSWER";
            }

            results.add(TestCaseResult.builder()
                    .testCaseNumber(i + 1)
                    .passed(testPassed)
                    .input(testCase.getInputData())
                    .expectedOutput(testCase.getExpectedOutput())
                    .actualOutput(execution.getOutput())
                    .error(execution.getErrorMessage())
                    .executionTime(execution.getExecutionTime())
                    .build());

            if (!testPassed) {
                break;
            }
        }

        boolean accepted = passed == testCases.size();
        if (accepted) {
            finalStatus = "ACCEPTED";
        }

        return JudgeResult.builder()
                .accepted(accepted)
                .status(finalStatus)
                .message(accepted ? "All test cases passed." :
                        (finalError != null ? finalError : "A test case failed."))
                .totalTestCases(testCases.size())
                .passedTestCases(passed)
                .executionTime(totalExecutionTime)
                .error(finalError)
                .testCaseResults(results)
                .build();
    }
}
