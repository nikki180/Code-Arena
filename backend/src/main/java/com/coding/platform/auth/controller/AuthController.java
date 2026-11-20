package com.coding.platform.auth.controller;

import org.springframework.web.bind.annotation.*;

import com.coding.platform.auth.dto.LoginRequest;
import com.coding.platform.auth.dto.LoginResponse;
import com.coding.platform.auth.dto.RegisterRequest;
import com.coding.platform.auth.service.AuthService;
import com.coding.platform.util.ApiResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/test")
    public String test() {
        return "Auth Controller Working";
    }

    @PostMapping("/register")
    public ApiResponse<String> register(
            @Valid @RequestBody RegisterRequest request) {

        return authService.register(request);
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return authService.login(request);
    }
}