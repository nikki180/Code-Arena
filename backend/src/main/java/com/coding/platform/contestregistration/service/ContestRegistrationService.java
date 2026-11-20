package com.coding.platform.contestregistration.service;

import java.util.List;

import com.coding.platform.contestregistration.dto.ContestRegistrationResponse;

public interface ContestRegistrationService {

    ContestRegistrationResponse registerForContest(Long contestId);

    List<ContestRegistrationResponse> getRegistrationsByContest(
            Long contestId);

    List<ContestRegistrationResponse> getMyRegistrations();
}