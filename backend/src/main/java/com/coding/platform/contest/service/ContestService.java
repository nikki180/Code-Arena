package com.coding.platform.contest.service;

import java.util.List;

import com.coding.platform.contest.dto.ContestRequest;
import com.coding.platform.contest.dto.ContestResponse;

public interface ContestService {

    ContestResponse createContest(ContestRequest request);

    List<ContestResponse> getAllContests();

    ContestResponse getContestById(Long id);

    ContestResponse updateContest(Long id, ContestRequest request);

    void deleteContest(Long id);
}

