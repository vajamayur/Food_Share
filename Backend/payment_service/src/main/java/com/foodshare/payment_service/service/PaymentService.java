package com.foodshare.payment_service.service;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.foodshare.payment_service.dto.CreateOrderRequest;
import com.foodshare.payment_service.dto.CreateOrderResponse;
import com.foodshare.payment_service.dto.VerifyPaymentRequest;
import com.foodshare.payment_service.entity.Payment;
import com.foodshare.payment_service.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final RazorpayClient razorpayClient;

    private final PaymentRepository paymentRepository;


    @Value("${razorpay.key.id}")
    private String razorpayKeyId;


    // ==========================================
    // CREATE ORDER
    // ==========================================

    @Transactional
    public CreateOrderResponse createOrder(
            CreateOrderRequest request
    ) throws Exception {


        if (request.getAmount() == null ||
                request.getAmount() <= 0) {

            throw new IllegalArgumentException(
                    "Amount must be greater than 0"
            );
        }


        /*
         * Razorpay amount is sent in paise.
         *
         * ₹500 = 50000 paise
         */

        int amountInPaise =
                (int) Math.round(
                        request.getAmount() * 100
                );


        JSONObject orderRequest =
                new JSONObject();

        orderRequest.put(
                "amount",
                amountInPaise
        );

        orderRequest.put(
                "currency",
                "INR"
        );

        orderRequest.put(
                "receipt",
                "FOODSHARE_" +
                System.currentTimeMillis()
        );


        Order order =
                razorpayClient.orders.create(
                        orderRequest
                );


        String orderId =
                order.get("id");


        Payment payment =
                Payment.builder()
                        .userId(request.getUserId())
                        .donationId(request.getDonationId())
                        .amount(request.getAmount())
                        .currency("INR")
                        .razorpayOrderId(orderId)
                        .status("CREATED")
                        .build();


        payment =
                paymentRepository.save(payment);


        return CreateOrderResponse.builder()
                .success(true)
                .message("Payment order created successfully")
                .paymentId(payment.getId())
                .orderId(orderId)
                .keyId(razorpayKeyId)
                .amount(request.getAmount())
                .currency("INR")
                .build();
    }


    // ==========================================
    // VERIFY PAYMENT
    // ==========================================

    @Transactional
    public boolean verifyPayment(
            VerifyPaymentRequest request
    ) throws Exception {


        Payment payment =
                paymentRepository
                        .findById(request.getPaymentId())
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Payment not found"
                                )
                        );


        /*
         * Important:
         *
         * Verify:
         *
         * order_id + "|" + payment_id
         *
         * using Razorpay secret.
         */

        String payload =
                request.getRazorpayOrderId()
                + "|"
                + request.getRazorpayPaymentId();


        boolean signatureValid =
                Utils.verifySignature(
                        payload,
                        request.getRazorpaySignature(),
                        getSecretKey()
                );


        if (!signatureValid) {

            payment.setStatus("FAILED");

            paymentRepository.save(payment);

            return false;
        }


        payment.setRazorpayPaymentId(
                request.getRazorpayPaymentId()
        );


        payment.setRazorpaySignature(
                request.getRazorpaySignature()
        );


        payment.setStatus("SUCCESS");


        paymentRepository.save(payment);


        return true;
    }


    @Value("${razorpay.key.secret}")
    private String secretKey;


    private String getSecretKey() {

        return secretKey;
    }
}