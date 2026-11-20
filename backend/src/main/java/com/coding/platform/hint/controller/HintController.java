package com.coding.platform.hint.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coding.platform.hint.dto.HintResponse;
import com.coding.platform.hint.service.HintService;

@RestController
@RequestMapping("/api/hints")
public class HintController {

    private final HintService hintService;

    public HintController(HintService hintService) {
        this.hintService = hintService;
    }

    // =========================================================
    // GET HINTS BY PROBLEM
    // USER + ADMIN
    // =========================================================

    @GetMapping("/problem/{problemId}")
    public List<HintResponse> getHintsByProblemId(
            @PathVariable Long problemId) {

        return hintService.getHintsByProblemId(problemId);
    }
}