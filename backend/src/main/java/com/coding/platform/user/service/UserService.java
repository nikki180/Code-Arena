package com.coding.platform.user.service;

import java.util.List;

import com.coding.platform.user.dto.UserDto;
import com.coding.platform.util.ApiResponse;

public interface UserService {

    ApiResponse<List<UserDto>> getAllUsers();

    ApiResponse<UserDto> getUserById(Long id);

    ApiResponse<UserDto> updateUser(Long id, UserDto userDto);

    ApiResponse<String> deleteUser(Long id);

}