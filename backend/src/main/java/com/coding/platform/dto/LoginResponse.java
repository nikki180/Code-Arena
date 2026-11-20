package com.coding.platform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String token;

    private String type;

    private Long userId;

    private String fullName;

    private String username;

    private String email;

    private String role;

}