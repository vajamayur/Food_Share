package com.foodshare.auth_service.controller;

import com.foodshare.auth_service.dto.AuthResponse;
import com.foodshare.auth_service.dto.LoginRequest;
import com.foodshare.auth_service.dto.RegisterRequest;
import com.foodshare.auth_service.service.AuthService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;


    // =========================================
    // REGISTER
    // =========================================

    @PostMapping("/register")
    public AuthResponse register(
            @Valid
            @RequestBody RegisterRequest request) {

        return authService.register(request);
    }


    // =========================================
    // LOGIN
    // =========================================

    @PostMapping("/login")
    public AuthResponse login(
            @Valid
            @RequestBody LoginRequest request) {

        return authService.login(request);
    }
}