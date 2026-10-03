package com.foodshare.payment_service.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateOrderRequest {

    private Long userId;

    private Long donationId;

    private Double amount;
}