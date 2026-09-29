package com.foodshare.request_service.dto;

import java.time.LocalDateTime;

import com.foodshare.request_service.entity.DeliveryStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryResponse {
    private Long id;
    private Long foodId;
    private Long volunteerId;
    private DeliveryStatus status;
    private LocalDateTime claimedAt;
    private LocalDateTime deliveredAt;
}