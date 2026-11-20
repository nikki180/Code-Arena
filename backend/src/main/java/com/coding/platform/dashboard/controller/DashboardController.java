package com.coding.platform.dashboard.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coding.platform.dashboard.dto.DashboardResponse;
import com.coding.platform.dashboard.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    // =========================================================
    // GET CURRENT USER DASHBOARD
    // USER + ADMIN
    // =========================================================

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard() {

        DashboardResponse response =
                dashboardService.getDashboard();

        return ResponseEntity.ok(response);
    }
}