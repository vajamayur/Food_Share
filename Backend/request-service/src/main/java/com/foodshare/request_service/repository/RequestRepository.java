package com.foodshare.request_service.repository;

import com.foodshare.request_service.entity.FoodRequest;
import com.foodshare.request_service.entity.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RequestRepository extends JpaRepository<FoodRequest, Long> {

    List<FoodRequest> findByUserId(Long userId);

    List<FoodRequest> findByStatus(RequestStatus status);
}