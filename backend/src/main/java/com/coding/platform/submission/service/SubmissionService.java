package com.coding.platform.submission.service;

import java.util.List;

import com.coding.platform.submission.dto.SubmissionRequest;
import com.coding.platform.submission.dto.SubmissionResponse;
import com.coding.platform.util.ApiResponse;

public interface SubmissionService {

    ApiResponse<SubmissionResponse> createSubmission(
            SubmissionRequest request
    );

    ApiResponse<SubmissionResponse> getSubmissionById(
            Long id
    );

    ApiResponse<List<SubmissionResponse>> getAllSubmissions();

    ApiResponse<List<SubmissionResponse>> getSubmissionsByUser(
            Long userId
    );

    ApiResponse<List<SubmissionResponse>> getSubmissionsByProblem(
            Long problemId
    );

    ApiResponse<SubmissionResponse> updateSubmissionStatus(
            Long id,
            String status
    );

    ApiResponse<String> deleteSubmission(
            Long id
    );
}