package com.foodshare.password_reset_service.dto;

import lombok.Data;

@Data
public class ForgotPasswordRequest {

    private String email;
}