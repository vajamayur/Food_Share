package com.foodshare.user_service.service;

import java.util.List;

import com.foodshare.user_service.dto.LoginRequest;
import com.foodshare.user_service.dto.SignupRequest;
import com.foodshare.user_service.dto.UserResponse;

public interface UserService {

    UserResponse register(SignupRequest request);

    UserResponse login(LoginRequest request);

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);

    UserResponse updateUser(Long id, SignupRequest request);

    void deleteUser(Long id);
}
