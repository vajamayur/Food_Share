package com.foodshare.auth_service.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodshare.auth_service.dto.AuthResponse;
import com.foodshare.auth_service.dto.ForgotPasswordRequest;
import com.foodshare.auth_service.dto.LoginRequest;
import com.foodshare.auth_service.dto.RegisterRequest;
import com.foodshare.auth_service.dto.ResetPasswordRequest;
import com.foodshare.auth_service.dto.VerifyOtpRequest;
import com.foodshare.auth_service.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
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

    // =========================================
    // FORGOT PASSWORD
    // =========================================

    @PostMapping("/forgot-password")
    public AuthResponse forgotPassword(
            @Valid
            @RequestBody ForgotPasswordRequest request) {

        return authService.forgotPassword(request);
    }

    // =========================================
    // VERIFY OTP
    // =========================================

    @PostMapping("/verify-otp")
    public AuthResponse verifyOtp(
            @Valid
            @RequestBody VerifyOtpRequest request) {

        return authService.verifyOtp(request);
    }

    // =========================================
    // RESET PASSWORD
    // =========================================

    @PostMapping("/reset-password")
    public AuthResponse resetPassword(
            @Valid
            @RequestBody ResetPasswordRequest request) {

        return authService.resetPassword(request);
    }
}