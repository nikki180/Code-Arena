package com.coding.platform.contestregistration.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContestRegistrationResponse {

    private Long id;
    private Long contestId;
    private Long userId;
    private LocalDateTime registeredAt;
    private String status;
}