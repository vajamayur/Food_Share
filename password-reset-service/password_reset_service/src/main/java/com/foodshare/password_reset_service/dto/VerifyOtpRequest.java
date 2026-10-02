package com.foodshare.password_reset_service.dto;

import lombok.Data;

@Data
public class VerifyOtpRequest {

    private String email;

    private String otp;
}