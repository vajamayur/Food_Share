package com.foodshare.payment_service.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyPaymentRequest {

    private Long paymentId;

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private String razorpaySignature;
}