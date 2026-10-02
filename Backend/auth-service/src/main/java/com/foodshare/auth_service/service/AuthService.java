package com.foodshare.auth_service.service;

<<<<<<< HEAD
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

=======
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Random;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.foodshare.auth_service.dto.AuthResponse;
import com.foodshare.auth_service.dto.ForgotPasswordRequest;
import com.foodshare.auth_service.dto.LoginRequest;
import com.foodshare.auth_service.dto.RegisterRequest;
import com.foodshare.auth_service.dto.ResetPasswordRequest;
import com.foodshare.auth_service.dto.VerifyOtpRequest;
import com.foodshare.auth_service.entity.PasswordResetToken;
import com.foodshare.auth_service.entity.User;
import com.foodshare.auth_service.repository.PasswordResetTokenRepository;
import com.foodshare.auth_service.repository.UserRepository;
import com.foodshare.auth_service.security.JwtService;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;

    private final PasswordResetTokenRepository passwordResetTokenRepository;

>>>>>>> 713e2ec (Add New Feature in Forgot Password)
    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

<<<<<<< HEAD
=======
    private final JavaMailSender mailSender;

    @Autowired
    public AuthService(
            UserRepository userRepository,
            PasswordResetTokenRepository passwordResetTokenRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            @Autowired(required = false) JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.mailSender = mailSender;
    }
>>>>>>> 713e2ec (Add New Feature in Forgot Password)

    // =========================================
    // REGISTER
    // =========================================

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {

            return AuthResponse.builder()
                    .token(null)
                    .message("Email already registered")
<<<<<<< HEAD
=======
                    .success(false)
>>>>>>> 713e2ec (Add New Feature in Forgot Password)
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
<<<<<<< HEAD

=======
                .success(true)
>>>>>>> 713e2ec (Add New Feature in Forgot Password)
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
<<<<<<< HEAD
=======
                    .success(false)
>>>>>>> 713e2ec (Add New Feature in Forgot Password)
                    .build();
        }


        if (!Boolean.TRUE.equals(user.getActive())) {

            return AuthResponse.builder()
                    .token(null)
                    .message("Account is inactive")
<<<<<<< HEAD
=======
                    .success(false)
>>>>>>> 713e2ec (Add New Feature in Forgot Password)
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
<<<<<<< HEAD
=======
                    .success(false)
>>>>>>> 713e2ec (Add New Feature in Forgot Password)
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
<<<<<<< HEAD

=======
                .success(true)
>>>>>>> 713e2ec (Add New Feature in Forgot Password)
                .message("Login Successful")

                .userId(user.getId())

                .fullName(user.getFullName())

                .email(user.getEmail())

                .role(user.getRole().name())

                .build();
    }
<<<<<<< HEAD
=======

    public AuthResponse forgotPassword(ForgotPasswordRequest request) {
        String email = normalizeEmail(request.getEmail());

        if (email == null || email.isBlank()) {
            return AuthResponse.builder()
                    .message("Email is required")
                    .success(false)
                    .build();
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return AuthResponse.builder()
                    .message("If this email is registered, an OTP has been sent.")
                    .email(email)
                    .success(true)
                    .build();
        }

        String otp = generateOtp();
        PasswordResetToken resetToken = passwordResetTokenRepository.findByEmail(email).orElse(null);

        if (resetToken == null) {
            resetToken = PasswordResetToken.builder()
                    .email(email)
                    .build();
        }

        resetToken.setOtp(otp);
        resetToken.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        resetToken.setVerified(false);
        passwordResetTokenRepository.save(resetToken);

        if (!sendOtpEmail(email, otp)) {
            return AuthResponse.builder()
                    .message("Unable to send password-reset email. Check SMTP configuration and try again.")
                    .email(email)
                    .success(false)
                    .build();
        }

        return AuthResponse.builder()
                .message("OTP sent to your email.")
                .email(email)
                .success(true)
                .build();
    }

    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        String email = normalizeEmail(request.getEmail());
        String otp = request.getOtp() == null ? "" : request.getOtp().trim();

        PasswordResetToken resetToken = passwordResetTokenRepository.findByEmail(email).orElse(null);
        if (resetToken == null || resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            if (resetToken != null) {
                passwordResetTokenRepository.delete(resetToken);
            }
            return AuthResponse.builder()
                    .message("Invalid or expired OTP")
                    .email(email)
                    .success(false)
                    .build();
        }

        if (!Objects.equals(resetToken.getOtp(), otp)) {
            return AuthResponse.builder()
                    .message("Invalid OTP")
                    .email(email)
                    .success(false)
                    .build();
        }

        resetToken.setVerified(true);
        passwordResetTokenRepository.save(resetToken);

        return AuthResponse.builder()
                .message("OTP verified successfully")
                .email(email)
                .otp(otp)
                .success(true)
                .build();
    }

    public AuthResponse resetPassword(ResetPasswordRequest request) {
        String email = normalizeEmail(request.getEmail());
        String otp = request.getOtp() == null ? "" : request.getOtp().trim();
        String newPassword = request.getNewPassword();

        if (email == null || email.isBlank()) {
            return AuthResponse.builder()
                    .message("Email is required")
                    .success(false)
                    .build();
        }

        PasswordResetToken resetToken = passwordResetTokenRepository.findByEmail(email).orElse(null);
        if (resetToken == null || resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            if (resetToken != null) {
                passwordResetTokenRepository.delete(resetToken);
            }
            return AuthResponse.builder()
                    .message("OTP verification required")
                    .email(email)
                    .success(false)
                    .build();
        }

        if (!resetToken.isVerified() || !Objects.equals(resetToken.getOtp(), otp)) {
            return AuthResponse.builder()
                    .message("OTP verification required")
                    .email(email)
                    .success(false)
                    .build();
        }

        if (newPassword == null || newPassword.length() < 6) {
            return AuthResponse.builder()
                    .message("Password must be at least 6 characters")
                    .email(email)
                    .success(false)
                    .build();
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return AuthResponse.builder()
                    .message("User not found")
                    .email(email)
                    .success(false)
                    .build();
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        passwordResetTokenRepository.delete(resetToken);

        return AuthResponse.builder()
                .message("Password reset successfully")
                .email(email)
                .success(true)
                .build();
    }

    private String normalizeEmail(String email) {
        if (email == null) {
            return null;
        }
        String normalized = email.trim().toLowerCase();
        return normalized.isBlank() ? null : normalized;
    }

    private String generateOtp() {
        return String.format("%06d", new Random().nextInt(1000000));
    }

        private boolean sendOtpEmail(String email, String otp) {
        if (mailSender == null) {
                        log.warn("No JavaMailSender configured; password-reset email was not sent.");
                        return false;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("FoodShare password reset OTP");
            message.setText("Your FoodShare OTP is: " + otp + "\nIt expires in 5 minutes.");
            mailSender.send(message);
            log.info("OTP sent to {} via email", email);
                        return true;
        } catch (Exception e) {
                        log.warn("Email delivery failed for {}: {}", email, e.getMessage());
                        return false;
        }
    }

>>>>>>> 713e2ec (Add New Feature in Forgot Password)
}