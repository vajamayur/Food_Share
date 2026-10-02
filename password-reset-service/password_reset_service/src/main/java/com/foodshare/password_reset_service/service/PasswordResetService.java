package com.foodshare.password_reset_service.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.foodshare.password_reset_service.dto.ForgotPasswordRequest;
import com.foodshare.password_reset_service.dto.ResetPasswordRequest;
import com.foodshare.password_reset_service.dto.VerifyOtpRequest;
import com.foodshare.password_reset_service.entity.PasswordReset;
import com.foodshare.password_reset_service.repository.PasswordResetRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final PasswordResetRepository repository;

    private final EmailService emailService;

    private final AuthServiceClient authServiceClient;

    private final SecureRandom secureRandom =
            new SecureRandom();


    // =====================================================
    // SEND OTP
    // =====================================================

    public String sendOtp(
            ForgotPasswordRequest request) {

        String email =
                normalizeEmail(request.getEmail());


        if (email == null) {

            throw new RuntimeException(
                    "Email is required"
            );
        }


        /*
         * Check account through Auth Service.
         */
        boolean exists =
                authServiceClient.accountExists(email);


        /*
         * Do not reveal whether account exists.
         */
        if (!exists) {

            return
                "If this email is registered, an OTP has been sent.";
        }


        /*
         * Remove old reset request.
         */
        repository.deleteByEmail(email);


        /*
         * Generate OTP.
         */
        String otp =
                generateOtp();


        /*
         * Hash OTP before database storage.
         */
        String otpHash =
                hash(otp);


        PasswordReset reset =
                PasswordReset.builder()

                        .email(email)

                        .otpHash(otpHash)

                        .otpExpiry(
                                LocalDateTime.now()
                                        .plusMinutes(5)
                        )

                        .otpAttempts(0)

                        .otpVerified(false)

                        .resetTokenUsed(false)

                        .createdAt(
                                LocalDateTime.now()
                        )

                        .updatedAt(
                                LocalDateTime.now()
                        )

                        .build();


        repository.save(reset);


        /*
         * Send OTP.
         */
        emailService.sendOtp(
                email,
                otp
        );


        return
            "If this email is registered, an OTP has been sent.";
    }


    // =====================================================
    // VERIFY OTP
    // =====================================================

    public String verifyOtp(
            VerifyOtpRequest request) {

        String email =
                normalizeEmail(request.getEmail());


        String otp =
                request.getOtp();


        if (otp == null ||
                otp.trim().isEmpty()) {

            throw new RuntimeException(
                    "OTP is required"
            );
        }


        otp = otp.trim();


        Optional<PasswordReset> optional =
                repository
                        .findTopByEmailOrderByIdDesc(
                                email
                        );


        if (optional.isEmpty()) {

            throw new RuntimeException(
                    "Invalid OTP"
            );
        }


        PasswordReset reset =
                optional.get();


        /*
         * Maximum 5 attempts.
         */
        if (reset.getOtpAttempts() >= 5) {

            throw new RuntimeException(
                    "Too many attempts. Request a new OTP."
            );
        }


        /*
         * Check expiry.
         */
        if (LocalDateTime.now()
                .isAfter(reset.getOtpExpiry())) {

            throw new RuntimeException(
                    "OTP expired. Request a new OTP."
            );
        }


        /*
         * Hash entered OTP.
         */
        String enteredHash =
                hash(otp);


        /*
         * Compare hashes.
         */
        if (!enteredHash.equals(
                reset.getOtpHash())) {


            reset.setOtpAttempts(
                    reset.getOtpAttempts() + 1
            );

            reset.setUpdatedAt(
                    LocalDateTime.now()
            );

            repository.save(reset);


            throw new RuntimeException(
                    "Invalid OTP"
            );
        }


        /*
         * OTP verified.
         */
        reset.setOtpVerified(true);


        /*
         * Generate one-time reset token.
         */
        String resetToken =
                UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                +
                UUID.randomUUID()
                        .toString()
                        .replace("-", "");


        String resetTokenHash =
                hash(resetToken);


        reset.setResetTokenHash(
                resetTokenHash
        );


        /*
         * Reset token valid for 10 minutes.
         */
        reset.setResetTokenExpiry(
                LocalDateTime.now()
                        .plusMinutes(10)
        );


        reset.setResetTokenUsed(false);

        reset.setUpdatedAt(
                LocalDateTime.now()
        );


        repository.save(reset);


        /*
         * IMPORTANT:
         * Do not send OTP again.
         *
         * Return resetToken to React.
         */
        return resetToken;
    }


    // =====================================================
    // RESET PASSWORD
    // =====================================================

    public String resetPassword(
            ResetPasswordRequest request) {

        String email =
                normalizeEmail(request.getEmail());


        String resetToken =
                request.getResetToken();


        String newPassword =
                request.getNewPassword();


        if (resetToken == null ||
                resetToken.trim().isEmpty()) {

            throw new RuntimeException(
                    "Reset token is required"
            );
        }


        if (newPassword == null ||
                newPassword.length() < 8) {

            throw new RuntimeException(
                    "Password must contain at least 8 characters"
            );
        }


        String tokenHash =
                hash(resetToken);


        Optional<PasswordReset> optional =
                repository
                        .findTopByEmailOrderByIdDesc(
                                email
                        );


        if (optional.isEmpty()) {

            throw new RuntimeException(
                    "Invalid reset request"
            );
        }


        PasswordReset reset =
                optional.get();


        /*
         * Check OTP verification.
         */
        if (!reset.isOtpVerified()) {

            throw new RuntimeException(
                    "OTP verification required"
            );
        }


        /*
         * Check token.
         */
        if (reset.getResetTokenHash() == null ||
                !reset.getResetTokenHash()
                        .equals(tokenHash)) {

            throw new RuntimeException(
                    "Invalid reset token"
            );
        }


        /*
         * Check token expiry.
         */
        if (reset.getResetTokenExpiry() == null ||
                LocalDateTime.now()
                        .isAfter(
                                reset.getResetTokenExpiry()
                        )) {

            throw new RuntimeException(
                    "Reset token expired"
            );
        }


        /*
         * Check one-time usage.
         */
        if (reset.isResetTokenUsed()) {

            throw new RuntimeException(
                    "Reset token already used"
            );
        }


        /*
         * Call Auth Service.
         */
        authServiceClient.updatePassword(
                email,
                newPassword
        );


        /*
         * Mark token as used.
         */
        reset.setResetTokenUsed(true);

        reset.setUpdatedAt(
                LocalDateTime.now()
        );


        repository.save(reset);


        return
                "Password reset successfully";
    }


    // =====================================================
    // GENERATE OTP
    // =====================================================

    private String generateOtp() {

        int number =
                100000 +
                secureRandom.nextInt(900000);

        return String.valueOf(number);
    }


    // =====================================================
    // HASH
    // =====================================================

    private String hash(
            String value) {

        try {

            MessageDigest digest =
                    MessageDigest.getInstance(
                            "SHA-256"
                    );


            byte[] hash =
                    digest.digest(
                            value.getBytes(
                                    StandardCharsets.UTF_8
                            )
                    );


            return HexFormat.of()
                    .formatHex(hash);


        } catch (Exception e) {

            throw new RuntimeException(
                    "Hashing failed"
            );
        }
    }


    // =====================================================
    // NORMALIZE EMAIL
    // =====================================================

    private String normalizeEmail(
            String email) {

        if (email == null) {

            return null;
        }

        String value =
                email.trim()
                        .toLowerCase();

        return value.isEmpty()
                ? null
                : value;
    }
}

interface EmailService {

    void sendOtp(String email, String otp);
}