package com.foodshare.food_service.repository;

import com.foodshare.food_service.entity.Food;
import com.foodshare.food_service.entity.FoodStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodRepository extends JpaRepository<Food, Long> {

    List<Food> findByDonorId(Long donorId);

    List<Food> findByStatus(FoodStatus status);
}