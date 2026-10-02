package com.foodshare.password_reset_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.foodshare.password_reset_service.entity.PasswordReset;

public interface PasswordResetRepository
        extends JpaRepository<PasswordReset, Long> {

    Optional<PasswordReset>
    findTopByEmailOrderByIdDesc(String email);

    Optional<PasswordReset>
    findByResetTokenHash(String resetTokenHash);

    void deleteByEmail(String email);
}