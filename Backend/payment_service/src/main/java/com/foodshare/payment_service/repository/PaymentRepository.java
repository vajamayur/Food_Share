package com.foodshare.payment_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.foodshare.payment_service.entity.Payment;

public interface PaymentRepository
        extends JpaRepository<Payment, Long> {


    Optional<Payment> findByRazorpayOrderId(
            String razorpayOrderId
    );


    Optional<Payment> findByRazorpayPaymentId(
            String razorpayPaymentId
    );


    List<Payment> findByUserId(
            Long userId
    );


    List<Payment> findByDonationId(
            Long donationId
    );
}