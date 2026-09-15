package com.foodshare.food_service.service;


import com.foodshare.food_service.dto.FoodRequest;
import com.foodshare.food_service.dto.FoodResponse;
import com.foodshare.food_service.entity.Food;
import com.foodshare.food_service.entity.FoodStatus;
import com.foodshare.food_service.repository.FoodRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodServiceImpl implements FoodService {

    private final FoodRepository foodRepository;


    public FoodServiceImpl(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }


    // =========================
    // CREATE FOOD
    // =========================

    @Override
    public FoodResponse createFood(FoodRequest request) {

        Food food = new Food();

        food.setDonorId(request.getDonorId());
        food.setFoodName(request.getFoodName());
        food.setCategory(request.getCategory());
        food.setQuantity(request.getQuantity());
        food.setUnit(request.getUnit());
        food.setExpiryTime(request.getExpiryTime());
        food.setPickupAddress(request.getPickupAddress());
        food.setDescription(request.getDescription());

        food.setStatus(FoodStatus.AVAILABLE);

        Food savedFood = foodRepository.save(food);

        return convertToResponse(savedFood);
    }


    // =========================
    // GET ALL FOODS
    // =========================

    @Override
    public List<FoodResponse> getAllFoods() {

        return foodRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // =========================
    // GET FOOD BY ID
    // =========================

    @Override
    public FoodResponse getFoodById(Long id) {

        Food food = foodRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Food not found with ID: " + id));

        return convertToResponse(food);
    }


    // =========================
    // GET FOODS BY DONOR
    // =========================

    @Override
    public List<FoodResponse> getFoodsByDonor(Long donorId) {

        return foodRepository.findByDonorId(donorId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // =========================
    // GET AVAILABLE FOODS
    // =========================

    @Override
    public List<FoodResponse> getAvailableFoods() {

        return foodRepository
                .findByStatus(FoodStatus.AVAILABLE)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // =========================
    // UPDATE FOOD
    // =========================

    @Override
    public FoodResponse updateFood(
            Long id,
            FoodRequest request) {

        Food food = foodRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Food not found with ID: " + id));


        food.setFoodName(request.getFoodName());
        food.setCategory(request.getCategory());
        food.setQuantity(request.getQuantity());
        food.setUnit(request.getUnit());
        food.setExpiryTime(request.getExpiryTime());
        food.setPickupAddress(request.getPickupAddress());
        food.setDescription(request.getDescription());


        Food updatedFood = foodRepository.save(food);

        return convertToResponse(updatedFood);
    }


    // =========================
    // DELETE FOOD
    // =========================

    @Override
    public void deleteFood(Long id) {

        if (!foodRepository.existsById(id)) {

            throw new RuntimeException(
                    "Food not found with ID: " + id);
        }

        foodRepository.deleteById(id);
    }


    // =========================
    // ENTITY → RESPONSE
    // =========================

    private FoodResponse convertToResponse(Food food) {

        FoodResponse response = new FoodResponse();

        response.setId(food.getId());
        response.setDonorId(food.getDonorId());
        response.setFoodName(food.getFoodName());
        response.setCategory(food.getCategory());
        response.setQuantity(food.getQuantity());
        response.setUnit(food.getUnit());
        response.setExpiryTime(food.getExpiryTime());
        response.setPickupAddress(food.getPickupAddress());
        response.setDescription(food.getDescription());
        response.setStatus(food.getStatus());
        response.setCreatedAt(food.getCreatedAt());

        return response;
    }
}