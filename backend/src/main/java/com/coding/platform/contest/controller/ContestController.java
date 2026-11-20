package com.coding.platform.contest.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.coding.platform.contest.dto.ContestRequest;
import com.coding.platform.contest.dto.ContestResponse;
import com.coding.platform.contest.service.ContestService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/contests")
public class ContestController {

    private final ContestService contestService;

    public ContestController(ContestService contestService) {
        this.contestService = contestService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ContestResponse createContest(
            @Valid @RequestBody ContestRequest request) {

        return contestService.createContest(request);
    }

    @GetMapping
    public List<ContestResponse> getAllContests() {

        return contestService.getAllContests();
    }

    @GetMapping("/{id}")
    public ContestResponse getContestById(
            @PathVariable Long id) {

        return contestService.getContestById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ContestResponse updateContest(
            @PathVariable Long id,
            @Valid @RequestBody ContestRequest request) {

        return contestService.updateContest(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteContest(
            @PathVariable Long id) {

        contestService.deleteContest(id);
    }
}