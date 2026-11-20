package com.coding.platform.contestsubmission.service;

import java.util.List;

import com.coding.platform.contestsubmission.dto.ContestSubmissionEvaluationRequest;
import com.coding.platform.contestsubmission.dto.ContestSubmissionRequest;
import com.coding.platform.contestsubmission.dto.ContestSubmissionResponse;

public interface ContestSubmissionService {

    ContestSubmissionResponse submitSolution(
            ContestSubmissionRequest request);

    List<ContestSubmissionResponse> getMySubmissions(
            Long contestId);

    List<ContestSubmissionResponse> getContestSubmissions(
            Long contestId);

    ContestSubmissionResponse evaluateSubmission(
            Long submissionId,
            ContestSubmissionEvaluationRequest request);
}