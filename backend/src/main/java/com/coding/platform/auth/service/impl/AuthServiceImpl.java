package com.coding.platform.auth.service.impl;

import java.time.LocalDateTime;
import com.coding.platform.security.JwtService;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.coding.platform.auth.dto.LoginRequest;
import com.coding.platform.auth.dto.LoginResponse;
import com.coding.platform.auth.dto.RegisterRequest;
import com.coding.platform.auth.service.AuthService;
import com.coding.platform.common.Role;
import com.coding.platform.user.entity.User;
import com.coding.platform.user.repository.UserRepository;
import com.coding.platform.util.ApiResponse;
import com.coding.platform.util.ResponseBuilder;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public ApiResponse<String> register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseBuilder.error("Email already exists");
        }

        
        User user = User.builder()
                .fullName(request.getFullName())
               
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .profileImage(null)
                .totalProblemSolved(0)
                .totalSubmission(0)
                .currentStreak(0)
                .maxStreak(0)
                .isVerified(false)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        return ResponseBuilder.success(
                "User registered successfully",
                "Registration Successful");
    }

    @Override
    public ApiResponse<LoginResponse> login(LoginRequest request) {

        Optional<User> optionalUser =
                userRepository.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            return ResponseBuilder.error("Invalid email or password");
        }

        User user = optionalUser.get();

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            return ResponseBuilder.error("This account is inactive");
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            return ResponseBuilder.error("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail());

        LoginResponse response = LoginResponse.builder()
                .token(token)
                .type("Bearer")
                .userId(user.getId())
                .fullName(user.getFullName())
               
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();

        return ResponseBuilder.success(
                "Login successful",
                response);
    }

}
