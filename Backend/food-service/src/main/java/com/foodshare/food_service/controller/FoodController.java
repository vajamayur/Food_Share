package com.foodshare.food_service.controller;

import com.foodshare.food_service.dto.FoodRequest;
import com.foodshare.food_service.dto.FoodResponse;
import com.foodshare.food_service.service.FoodService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
@CrossOrigin(origins = "*")
public class FoodController {

    private final FoodService foodService;

    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }


    // ==========================================
    // CREATE FOOD
    // ==========================================

    @PostMapping
    public ResponseEntity<FoodResponse> createFood(
            @Valid @RequestBody FoodRequest request) {

        FoodResponse response =
                foodService.createFood(request);

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }


    // ==========================================
    // GET ALL FOODS
    // ==========================================

    @GetMapping
    public ResponseEntity<List<FoodResponse>> getAllFoods() {

        return ResponseEntity.ok(
                foodService.getAllFoods()
        );
    }


    // ==========================================
    // GET FOOD BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<FoodResponse> getFoodById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                foodService.getFoodById(id)
        );
    }


    // ==========================================
    // GET FOODS BY DONOR
    // ==========================================

    @GetMapping("/donor/{donorId}")
    public ResponseEntity<List<FoodResponse>> getFoodsByDonor(
            @PathVariable Long donorId) {

        return ResponseEntity.ok(
                foodService.getFoodsByDonor(donorId)
        );
    }


    // ==========================================
    // GET AVAILABLE FOODS
    // ==========================================

    @GetMapping("/available")
    public ResponseEntity<List<FoodResponse>> getAvailableFoods() {

        return ResponseEntity.ok(
                foodService.getAvailableFoods()
        );
    }


    // ==========================================
    // UPDATE FOOD
    // ==========================================

    @PutMapping("/{id}")
    public ResponseEntity<FoodResponse> updateFood(
            @PathVariable Long id,
            @Valid @RequestBody FoodRequest request) {

        return ResponseEntity.ok(
                foodService.updateFood(id, request)
        );
    }


    // ==========================================
    // DELETE FOOD
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFood(
            @PathVariable Long id) {

        foodService.deleteFood(id);

        return ResponseEntity.ok(
                "Food deleted successfully"
        );
    }
}