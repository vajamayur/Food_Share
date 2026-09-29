package com.foodshare.request_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.foodshare.request_service.entity.Delivery;
import com.foodshare.request_service.entity.DeliveryStatus;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    List<Delivery> findByVolunteerId(Long volunteerId);
    Optional<Delivery> findByFoodIdAndVolunteerIdAndStatus(Long foodId, Long volunteerId, DeliveryStatus status);
}