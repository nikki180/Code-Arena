package com.coding.platform.auth.service;

import com.coding.platform.auth.dto.LoginRequest;
import com.coding.platform.auth.dto.LoginResponse;
import com.coding.platform.auth.dto.RegisterRequest;
import com.coding.platform.util.ApiResponse;

public interface AuthService {

    ApiResponse<String> register(RegisterRequest request);

    ApiResponse<LoginResponse> login(LoginRequest request);

}