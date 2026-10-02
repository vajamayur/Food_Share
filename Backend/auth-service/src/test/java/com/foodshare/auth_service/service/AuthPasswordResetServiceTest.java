package com.foodshare.auth_service.service;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.foodshare.auth_service.dto.ForgotPasswordRequest;
import com.foodshare.auth_service.dto.ResetPasswordRequest;
import com.foodshare.auth_service.dto.VerifyOtpRequest;
import com.foodshare.auth_service.entity.PasswordResetToken;
import com.foodshare.auth_service.entity.Role;
import com.foodshare.auth_service.entity.User;
import com.foodshare.auth_service.repository.PasswordResetTokenRepository;
import com.foodshare.auth_service.repository.UserRepository;
import com.foodshare.auth_service.security.JwtService;

class AuthPasswordResetServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void forgotPassword_shouldGenerateOtpAndResetPassword_shouldUpdatePassword() {
        User user = User.builder()
                .id(1L)
                .fullName("Test User")
                .email("test@example.com")
                .password("encoded-old")
                .role(Role.DONOR)
                .active(true)
                .build();

        PasswordResetToken[] storedToken = new PasswordResetToken[1];

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("NewPassword123")).thenReturn("encoded-new");
        when(passwordResetTokenRepository.findByEmail("test@example.com")).thenAnswer(invocation -> Optional.ofNullable(storedToken[0]));
        when(passwordResetTokenRepository.save(any(PasswordResetToken.class))).thenAnswer(invocation -> {
            storedToken[0] = invocation.getArgument(0);
            return storedToken[0];
        });
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        ForgotPasswordRequest forgotRequest = new ForgotPasswordRequest();
        forgotRequest.setEmail("test@example.com");

        var forgotResponse = authService.forgotPassword(forgotRequest);
        assertTrue(forgotResponse.getMessage().contains("OTP") || forgotResponse.getMessage().contains("sent"));
        assertNull(forgotResponse.getOtp());
        assertNotNull(storedToken[0]);
        ArgumentCaptor<SimpleMailMessage> mailMessageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(mailMessageCaptor.capture());
        String otp = mailMessageCaptor.getValue().getText().split("Your FoodShare OTP is: ")[1].split("\\n")[0];
        assertEquals(storedToken[0].getOtp(), otp);

        VerifyOtpRequest verifyRequest = new VerifyOtpRequest();
        verifyRequest.setEmail("test@example.com");
        verifyRequest.setOtp(otp);

        var verifyResponse = authService.verifyOtp(verifyRequest);
        assertTrue(verifyResponse.getMessage().contains("verified") || verifyResponse.getMessage().contains("OTP"));
        assertTrue(storedToken[0].isVerified());

        ResetPasswordRequest resetRequest = new ResetPasswordRequest();
        resetRequest.setEmail("test@example.com");
        resetRequest.setOtp(otp);
        resetRequest.setNewPassword("NewPassword123");

        var resetResponse = authService.resetPassword(resetRequest);
        assertTrue(resetResponse.getMessage().contains("updated") || resetResponse.getMessage().contains("reset"));
        verify(passwordEncoder).encode("NewPassword123");
        assertNotNull(storedToken[0]);
        assertNotNull(storedToken[0].getExpiresAt());
        assertFalse(storedToken[0].getExpiresAt().isBefore(LocalDateTime.now()));
    }
}
