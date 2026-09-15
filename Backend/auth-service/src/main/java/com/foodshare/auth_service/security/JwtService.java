package com.foodshare.auth_service.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    /**
     * Create secret key from configured secret.
     */
    private SecretKey getSigningKey() {

        return Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
    }

    /**
     * Generate JWT token for a user.
     */
    public String generateToken(
            String email,
            Long userId,
            String role) {

        Date now = new Date();

        Date expiryDate =
                new Date(now.getTime() + expiration);

        return Jwts.builder()
                .subject(email)
                .claim("userId", userId)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Extract email/username from JWT.
     */
    public String extractEmail(String token) {

        return extractAllClaims(token)
                .getSubject();
    }

    /**
     * Extract user ID from JWT.
     */
    public Long extractUserId(String token) {

        Object userId =
                extractAllClaims(token)
                        .get("userId");

        return Long.valueOf(userId.toString());
    }

    /**
     * Extract role from JWT.
     */
    public String extractRole(String token) {

        return extractAllClaims(token)
                .get("role", String.class);
    }

    /**
     * Check whether token is expired.
     */
    public boolean isTokenExpired(String token) {

        return extractAllClaims(token)
                .getExpiration()
                .before(new Date());
    }

    /**
     * Validate token.
     */
    public boolean isTokenValid(String token) {

        try {

            extractAllClaims(token);

            return !isTokenExpired(token);

        } catch (Exception e) {

            return false;
        }
    }

    /**
     * Extract all claims from token.
     */
    private Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}