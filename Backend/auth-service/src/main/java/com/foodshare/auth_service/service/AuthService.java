package com.foodshare.auth_service.service;

import com.foodshare.auth_service.dto.AuthResponse;
import com.foodshare.auth_service.dto.LoginRequest;
import com.foodshare.auth_service.dto.RegisterRequest;
import com.foodshare.auth_service.entity.User;
import com.foodshare.auth_service.repository.UserRepository;
import com.foodshare.auth_service.security.JwtService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;


    // =========================================
    // REGISTER
    // =========================================

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {

            return AuthResponse.builder()
                    .token(null)
                    .message("Email already registered")
                    .build();
        }

        User user = User.builder()

                .fullName(request.getFullName())

                .email(request.getEmail())

                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )

                .role(request.getRole())

                .active(true)

                .build();

        User savedUser =
                userRepository.save(user);


        // Generate JWT
        String token =
                jwtService.generateToken(
                        savedUser.getEmail(),
                        savedUser.getId(),
                        savedUser.getRole().name()
                );


        return AuthResponse.builder()

                .token(token)

                .message("Registration Successful")

                .userId(savedUser.getId())

                .fullName(savedUser.getFullName())

                .email(savedUser.getEmail())

                .role(savedUser.getRole().name())

                .build();
    }


    // =========================================
    // LOGIN
    // =========================================

    public AuthResponse login(LoginRequest request) {

        User user =
                userRepository
                        .findByEmail(request.getEmail())
                        .orElse(null);


        if (user == null) {

            return AuthResponse.builder()
                    .token(null)
                    .message("Invalid email or password")
                    .build();
        }


        if (!Boolean.TRUE.equals(user.getActive())) {

            return AuthResponse.builder()
                    .token(null)
                    .message("Account is inactive")
                    .build();
        }


        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );


        if (!passwordMatches) {

            return AuthResponse.builder()
                    .token(null)
                    .message("Invalid email or password")
                    .build();
        }


        // Generate JWT
        String token =
                jwtService.generateToken(
                        user.getEmail(),
                        user.getId(),
                        user.getRole().name()
                );


        return AuthResponse.builder()

                .token(token)

                .message("Login Successful")

                .userId(user.getId())

                .fullName(user.getFullName())

                .email(user.getEmail())

                .role(user.getRole().name())

                .build();
    }
}