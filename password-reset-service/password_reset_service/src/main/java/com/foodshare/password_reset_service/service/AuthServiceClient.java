package com.foodshare.password_reset_service.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceClient {

    private final RestClient.Builder restClientBuilder;

    @Value("${foodshare.internal-secret}")
    private String internalSecret;


    public boolean accountExists(
            String email) {

        try {

            Boolean result =
                    restClientBuilder
                            .build()
                            .get()
                            .uri(
                                "http://AUTH-SERVICE/internal/auth/account-exists?email={email}",
                                email
                            )
                            .header(
                                "X-Internal-Secret",
                                internalSecret
                            )
                            .retrieve()
                            .body(Boolean.class);

            return Boolean.TRUE.equals(result);

        } catch (Exception e) {

            return false;
        }
    }


    public void updatePassword(
            String email,
            String newPassword) {

        restClientBuilder
                .build()
                .post()
                .uri(
                    "http://AUTH-SERVICE/internal/auth/reset-password"
                )
                .header(
                    "X-Internal-Secret",
                    internalSecret
                )
                .body(
                    new PasswordUpdateRequest(
                        email,
                        newPassword
                    )
                )
                .retrieve()
                .toBodilessEntity();
    }


    public record PasswordUpdateRequest(
            String email,
            String newPassword
    ) {}
}