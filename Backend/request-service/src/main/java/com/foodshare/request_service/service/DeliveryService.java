package com.foodshare.request_service.service;

import com.foodshare.request_service.dto.DeliveryResponse;
import com.foodshare.request_service.entity.Delivery;
import com.foodshare.request_service.entity.DeliveryStatus;
import com.foodshare.request_service.repository.DeliveryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;

    public DeliveryResponse claim(Long foodId, Long volunteerId) {
        Delivery delivery = deliveryRepository
                .findByFoodIdAndVolunteerIdAndStatus(foodId, volunteerId, DeliveryStatus.CLAIMED)
                .orElseGet(() -> deliveryRepository.save(Delivery.builder()
                        .foodId(foodId)
                        .volunteerId(volunteerId)
                        .status(DeliveryStatus.CLAIMED)
                        .build()));
        return toResponse(delivery);
    }

    public void release(Long foodId, Long volunteerId) {
        deliveryRepository.findByFoodIdAndVolunteerIdAndStatus(foodId, volunteerId, DeliveryStatus.CLAIMED)
                .ifPresent(deliveryRepository::delete);
    }

    public DeliveryResponse deliver(Long foodId, Long volunteerId) {
        Delivery delivery = deliveryRepository
                .findByFoodIdAndVolunteerIdAndStatus(foodId, volunteerId, DeliveryStatus.CLAIMED)
                .orElseThrow(() -> new RuntimeException("Claimed delivery not found"));
        delivery.setStatus(DeliveryStatus.DELIVERED);
        delivery.setDeliveredAt(LocalDateTime.now());
        return toResponse(deliveryRepository.save(delivery));
    }

    public List<DeliveryResponse> getByVolunteer(Long volunteerId) {
        return deliveryRepository.findByVolunteerId(volunteerId).stream().map(this::toResponse).toList();
    }

    private DeliveryResponse toResponse(Delivery delivery) {
        return DeliveryResponse.builder()
                .id(delivery.getId())
                .foodId(delivery.getFoodId())
                .volunteerId(delivery.getVolunteerId())
                .status(delivery.getStatus())
                .claimedAt(delivery.getClaimedAt())
                .deliveredAt(delivery.getDeliveredAt())
                .build();
    }
}