package com.coding.platform.submissionresult.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coding.platform.submissionresult.dto.SubmissionResultResponse;
import com.coding.platform.submissionresult.entity.SubmissionResult;
import com.coding.platform.submissionresult.repository.SubmissionResultRepository;

@Service
@Transactional
public class SubmissionResultServiceImpl
        implements SubmissionResultService {

    private final SubmissionResultRepository submissionResultRepository;

    public SubmissionResultServiceImpl(
            SubmissionResultRepository submissionResultRepository) {

        this.submissionResultRepository =
                submissionResultRepository;
    }

    // =========================================================
    // GET RESULT BY SUBMISSION ID
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public SubmissionResultResponse getBySubmissionId(
            Long submissionId) {

        SubmissionResult result =
                submissionResultRepository
                        .findBySubmissionId(submissionId)
                        .orElse(null);

        if (result == null) {
            return null;
        }

        return mapToResponse(result);
    }

    // =========================================================
    // GET ALL RESULTS
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<SubmissionResultResponse> getAllResults() {

        return submissionResultRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================================================
    // ENTITY → RESPONSE
    // =========================================================

    private SubmissionResultResponse mapToResponse(
            SubmissionResult result) {

        return SubmissionResultResponse.builder()
                .id(result.getId())
                .submissionId(result.getSubmissionId())
                .totalTestCases(result.getTotalTestCases())
                .passedTestCases(result.getPassedTestCases())
                .failedTestCases(result.getFailedTestCases())
                .executionTime(result.getExecutionTime())
                .memoryUsed(result.getMemoryUsed())
                .score(result.getScore())
                .verdict(result.getVerdict())
                .evaluatedAt(result.getEvaluatedAt())
                .build();
    }
}