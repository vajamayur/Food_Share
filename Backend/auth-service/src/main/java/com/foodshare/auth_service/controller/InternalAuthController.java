package com.foodshare.auth_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodshare.auth_service.security.JwtService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

@RestController
@RequestMapping("/internal/auth")
public class InternalAuthController {

    private final JwtService jwtService;

    public InternalAuthController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @PostMapping("/validate")
    public ResponseEntity<TokenIdentity> validate(@Valid @RequestBody TokenValidationRequest request) {
        String token = request.token();
        if (!jwtService.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long userId = jwtService.extractUserId(token);
        String role = jwtService.extractRole(token);
        if (userId == null || role == null || role.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(new TokenIdentity(userId, role));
    }

    public record TokenValidationRequest(@NotBlank String token) {
    }

    public record TokenIdentity(Long userId, String role) {
    }
}
