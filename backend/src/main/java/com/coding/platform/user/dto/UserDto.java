package com.coding.platform.user.dto;

import com.coding.platform.common.Role;

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
public class UserDto {

    private Long id;

    private String fullName;

    private String email;

    private Role role;

    private String profileImage;

    private Integer totalProblemSolved;

    private Integer totalSubmission;

    private Integer currentStreak;

    private Integer maxStreak;

    private Boolean isVerified;

    private Boolean isActive;

}