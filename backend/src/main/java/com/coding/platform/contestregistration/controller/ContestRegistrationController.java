package com.coding.platform.contestregistration.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.coding.platform.contestregistration.dto.ContestRegistrationResponse;
import com.coding.platform.contestregistration.service.ContestRegistrationService;

@RestController
@RequestMapping("/api/contest-registrations")
public class ContestRegistrationController {

    private final ContestRegistrationService registrationService;

    public ContestRegistrationController(
            ContestRegistrationService registrationService) {

        this.registrationService = registrationService;
    }

    @PostMapping("/{contestId}")
    @ResponseStatus(HttpStatus.CREATED)
    public ContestRegistrationResponse registerForContest(
            @PathVariable Long contestId) {

        return registrationService.registerForContest(contestId);
    }

    @GetMapping("/my")
    public List<ContestRegistrationResponse> getMyRegistrations() {

        return registrationService.getMyRegistrations();
    }

    @GetMapping("/contest/{contestId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ContestRegistrationResponse> getRegistrationsByContest(
            @PathVariable Long contestId) {

        return registrationService
                .getRegistrationsByContest(contestId);
    }
}