package com.coding.platform.problem.service;

import java.util.List;

import com.coding.platform.problem.dto.ProblemRequest;
import com.coding.platform.problem.dto.ProblemResponse;
import com.coding.platform.util.ApiResponse;

public interface ProblemService {

    ApiResponse<ProblemResponse> createProblem(ProblemRequest request);

    ApiResponse<ProblemResponse> getProblemById(Long id);

    ApiResponse<List<ProblemResponse>> getAllProblems();

    ApiResponse<ProblemResponse> updateProblem(
            Long id,
            ProblemRequest request
    );

    ApiResponse<String> deleteProblem(Long id);
}