package com.foodshare.request_service.dto;

import com.foodshare.request_service.entity.RequestStatus;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequestResponse {

    private Long id;

    private Long foodId;

    private Long userId;

    private Integer quantity;

    private String message;

    private RequestStatus status;

    private LocalDateTime createdAt;
}