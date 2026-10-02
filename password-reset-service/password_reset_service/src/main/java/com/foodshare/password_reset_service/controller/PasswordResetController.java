package com.foodshare.password_reset_service.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodshare.password_reset_service.dto.ForgotPasswordRequest;
import com.foodshare.password_reset_service.dto.ResetPasswordRequest;
import com.foodshare.password_reset_service.dto.VerifyOtpRequest;
import com.foodshare.password_reset_service.service.PasswordResetService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/password-reset")
@RequiredArgsConstructor
@CrossOrigin(
        origins = {
                "http://localhost:3000",
                "http://localhost:5173"
        }
)
public class PasswordResetController {


    private final PasswordResetService service;


    // =====================================================
    // SEND OTP
    // =====================================================

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(
            @RequestBody ForgotPasswordRequest request) {

        try {

            String message =
                    service.sendOtp(request);


            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "message", message
                    )
            );

        } catch (Exception e) {

            return ResponseEntity.badRequest()
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =====================================================
    // VERIFY OTP
    // =====================================================

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestBody VerifyOtpRequest request) {

        try {

            String resetToken =
                    service.verifyOtp(request);


            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "message",
                            "OTP verified successfully",

                            "resetToken",
                            resetToken
                    )
            );

        } catch (Exception e) {

            return ResponseEntity.badRequest()
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =====================================================
    // RESET PASSWORD
    // =====================================================

    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        try {

            String message =
                    service.resetPassword(request);


            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "message", message
                    )
            );

        } catch (Exception e) {

            return ResponseEntity.badRequest()
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }
}