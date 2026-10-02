package com.foodshare.password_reset_service.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodshare.password_reset_service.dto.ResetPasswordRequest;
import com.foodshare.password_reset_service.service.PasswordResetService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/internal/auth")
@RequiredArgsConstructor
public class InternalPasswordResetController {

    private final PasswordResetService passwordResetService;

    @Value("${foodshare.internal-secret}")
    private String internalSecret;

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestHeader("X-Internal-Secret") String secret,
            @RequestBody ResetPasswordRequest request) {

        validateSecret(secret);
        return ResponseEntity.ok(passwordResetService.resetPassword(request));
    }

    private void validateSecret(String secret) {
        if (secret == null || !secret.equals(internalSecret)) {
            throw new RuntimeException("Unauthorized internal request");
        }
    }
}