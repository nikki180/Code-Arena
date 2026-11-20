package com.coding.platform.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String token;

    @Builder.Default
    private String type = "Bearer";

    private Long userId;

    private String fullName;

   

    private String email;

    private String role;
}























