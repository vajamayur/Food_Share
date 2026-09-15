package com.foodshare.user_service.dto;

import com.foodshare.user_service.entity.Role;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {

    private Long id;

    private String fullName;

    private String email;

    private String phone;

    private String address;

    private Role role;
}
