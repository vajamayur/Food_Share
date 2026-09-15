package com.foodshare.user_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.foodshare.user_service.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email (used for login)
    Optional<User> findByEmail(String email);

    // Check if email already exists
    boolean existsByEmail(String email);

    // Check if phone number already exists
    boolean existsByPhone(String phone);
}
