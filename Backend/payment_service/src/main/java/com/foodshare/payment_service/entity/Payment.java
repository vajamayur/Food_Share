package com.foodshare.payment_service.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "donation_id")
    private Long donationId;


    @Column(name = "user_id")
    private Long userId;


    @Column(nullable = false)
    private Double amount;


    @Builder.Default
    @Column(nullable = false)
    private String currency = "INR";


    @Column(name = "razorpay_order_id")
    private String razorpayOrderId;


    @Column(name = "razorpay_payment_id")
    private String razorpayPaymentId;


    @Column(name = "razorpay_signature")
    private String razorpaySignature;


    @Builder.Default
    private String status = "CREATED";


    @Column(name = "created_at")
    private LocalDateTime createdAt;


    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    @PrePersist
    protected void onCreate() {

        LocalDateTime now = LocalDateTime.now();

        createdAt = now;
        updatedAt = now;
    }


    @PreUpdate
    protected void onUpdate() {

        updatedAt = LocalDateTime.now();
    }
}