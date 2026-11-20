package com.coding.platform.user.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

import com.coding.platform.user.dto.UserDto;
import com.coding.platform.user.service.UserService;
import com.coding.platform.util.ApiResponse;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // =========================================================
    // GET ALL USERS
    // =========================================================

    @GetMapping
    public ApiResponse<List<UserDto>> getAllUsers() {

        return userService.getAllUsers();
    }

    // =========================================================
    // GET USER BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ApiResponse<UserDto> getUserById(
            @PathVariable Long id) {

        return userService.getUserById(id);
    }

    // =========================================================
    // UPDATE USER
    // =========================================================

    @PutMapping("/{id}")
    public ApiResponse<UserDto> updateUser(
            @PathVariable Long id,
            @RequestBody UserDto userDto) {

        return userService.updateUser(id, userDto);
    }

    // =========================================================
    // DELETE USER
    // =========================================================

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteUser(
            @PathVariable Long id) {

        return userService.deleteUser(id);
    }
}
