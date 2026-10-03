package com.foodshare.payment_service.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodshare.payment_service.dto.CreateOrderRequest;
import com.foodshare.payment_service.dto.CreateOrderResponse;
import com.foodshare.payment_service.dto.VerifyPaymentRequest;
import com.foodshare.payment_service.entity.Payment;
import com.foodshare.payment_service.repository.PaymentRepository;
import com.foodshare.payment_service.service.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    private final PaymentRepository paymentRepository;


    // ==========================================
    // CREATE ORDER
    // ==========================================

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(
            @RequestBody CreateOrderRequest request
    ) {

        try {

            CreateOrderResponse response =
                    paymentService.createOrder(
                            request
                    );

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "success",
                    false
            );

            response.put(
                    "message",
                    e.getMessage()
            );

            return ResponseEntity
                    .badRequest()
                    .body(response);
        }
    }


    // ==========================================
    // VERIFY PAYMENT
    // ==========================================

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
            @RequestBody VerifyPaymentRequest request
    ) {

        try {

            boolean verified =
                    paymentService.verifyPayment(
                            request
                    );


            Map<String, Object> response =
                    new HashMap<>();


            response.put(
                    "success",
                    verified
            );


            if (verified) {

                response.put(
                        "message",
                        "Payment verified successfully"
                );

            } else {

                response.put(
                        "message",
                        "Payment verification failed"
                );
            }


            return ResponseEntity.ok(
                    response
            );

        } catch (Exception e) {

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "success",
                    false
            );

            response.put(
                    "message",
                    e.getMessage()
            );

            return ResponseEntity
                    .badRequest()
                    .body(response);
        }
    }


    // ==========================================
    // GET PAYMENT BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getPayment(
            @PathVariable Long id
    ) {

        return paymentRepository
                .findById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }


    // ==========================================
    // USER PAYMENTS
    // ==========================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Payment>> getUserPayments(
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(
                paymentRepository.findByUserId(userId)
        );
    }


    // ==========================================
    // DONATION PAYMENTS
    // ==========================================

    @GetMapping("/donation/{donationId}")
    public ResponseEntity<List<Payment>> getDonationPayments(
            @PathVariable Long donationId
    ) {

        return ResponseEntity.ok(
                paymentRepository.findByDonationId(
                        donationId
                )
        );
    }
}