package com.coding.platform.user.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.coding.platform.user.dto.UserDto;
import com.coding.platform.user.entity.User;
import com.coding.platform.user.repository.UserRepository;
import com.coding.platform.util.ApiResponse;
import com.coding.platform.util.ResponseBuilder;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public ApiResponse<List<UserDto>> getAllUsers() {

        List<UserDto> users = userRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseBuilder.success("Users fetched successfully", users);
    }

    @Override
    public ApiResponse<UserDto> getUserById(Long id) {

        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return ResponseBuilder.error("User not found");
        }

        return ResponseBuilder.success("User found", convertToDto(user));
    }

   

    @Override
    public ApiResponse<UserDto> updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return ResponseBuilder.error("User not found");

        if (userDto.getEmail() != null && !userDto.getEmail().equalsIgnoreCase(user.getEmail())) {
            if (userRepository.existsByEmail(userDto.getEmail())) {
                return ResponseBuilder.error("Email already exists");
            }
            user.setEmail(userDto.getEmail().trim());
        }
        if (userDto.getFullName() != null && !userDto.getFullName().isBlank()) {
            user.setFullName(userDto.getFullName().trim());
        }
        if (userDto.getRole() != null) user.setRole(userDto.getRole());
        if (userDto.getProfileImage() != null) user.setProfileImage(userDto.getProfileImage());
        if (userDto.getIsActive() != null) user.setIsActive(userDto.getIsActive());
        if (userDto.getIsVerified() != null) user.setIsVerified(userDto.getIsVerified());
        user.setUpdatedAt(java.time.LocalDateTime.now());

        return ResponseBuilder.success("User updated successfully", convertToDto(userRepository.save(user)));
    }

    @Override
    public ApiResponse<String> deleteUser(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return ResponseBuilder.error("User not found");
        userRepository.delete(user);
        return ResponseBuilder.success("User deleted successfully", "User " + id + " was deleted.");
    }

    private UserDto convertToDto(User user) {

        return UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
               
                .email(user.getEmail())
                .role(user.getRole())
                .profileImage(user.getProfileImage())
                .totalProblemSolved(user.getTotalProblemSolved())
                .totalSubmission(user.getTotalSubmission())
                .currentStreak(user.getCurrentStreak())
                .maxStreak(user.getMaxStreak())
                .isVerified(user.getIsVerified())
                .isActive(user.getIsActive())
                .build();
    }
}
