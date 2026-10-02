package com.foodshare.auth_service.security;

<<<<<<< HEAD
import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

=======
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;

>>>>>>> 713e2ec (Add New Feature in Forgot Password)
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

                // Disable CSRF
                .csrf(csrf -> csrf.disable())

                // JWT does not use HTTP session
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // Authorization rules
                .authorizeHttpRequests(auth -> auth

                        // Authentication APIs are public
                        .requestMatchers(
                                "/api/auth/register",
<<<<<<< HEAD
                                "/api/auth/login"
=======
                                "/api/auth/login",

                                // Forgot Password APIs
                                "/api/auth/forgot-password",
                                "/api/auth/verify-otp",
                                "/api/auth/reset-password"
>>>>>>> 713e2ec (Add New Feature in Forgot Password)
                        ).permitAll()

                        // Actuator endpoints
                        .requestMatchers(
<<<<<<< HEAD
=======
                                // "/actuator/**"
                                "/internal/auth/**"
                        ).permitAll()

                        .requestMatchers(
>>>>>>> 713e2ec (Add New Feature in Forgot Password)
                                "/actuator/**"
                        ).permitAll()

                        // Everything else requires authentication
                        .anyRequest().authenticated()
                )

<<<<<<< HEAD
                // Add JWT filter before UsernamePasswordAuthenticationFilter
=======
                // JWT filter
>>>>>>> 713e2ec (Add New Feature in Forgot Password)
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
<<<<<<< HEAD
}
=======
}

>>>>>>> 713e2ec (Add New Feature in Forgot Password)
