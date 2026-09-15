package com.foodshare.food_service.service;


import com.foodshare.food_service.dto.FoodRequest;
import com.foodshare.food_service.dto.FoodResponse;

import java.util.List;

public interface FoodService {

    FoodResponse createFood(FoodRequest request);

    List<FoodResponse> getAllFoods();

    FoodResponse getFoodById(Long id);

    List<FoodResponse> getFoodsByDonor(Long donorId);

    List<FoodResponse> getAvailableFoods();

    FoodResponse updateFood(Long id, FoodRequest request);

    void deleteFood(Long id);
}