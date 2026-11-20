package com.coding.platform.submissionresult.service;

import java.util.List;

import com.coding.platform.submissionresult.dto.SubmissionResultResponse;

public interface SubmissionResultService {

    SubmissionResultResponse getBySubmissionId(Long submissionId);

    List<SubmissionResultResponse> getAllResults();
}