package com.coding.platform.contestproblem.service;

import java.util.List;

import com.coding.platform.contestproblem.dto.ContestProblemRequest;
import com.coding.platform.contestproblem.dto.ContestProblemResponse;

public interface ContestProblemService {

    ContestProblemResponse addProblemToContest(
            ContestProblemRequest request);

    List<ContestProblemResponse> getProblemsByContestId(
            Long contestId);

}