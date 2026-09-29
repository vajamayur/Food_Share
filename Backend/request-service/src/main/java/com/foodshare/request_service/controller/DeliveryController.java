package com.foodshare.request_service.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodshare.request_service.dto.DeliveryResponse;
import com.foodshare.request_service.service.DeliveryService;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    @PostMapping("/claim")
    public ResponseEntity<DeliveryResponse> claim(@RequestBody DeliveryAction action) {
        return ResponseEntity.ok(deliveryService.claim(action.foodId, action.volunteerId));
    }

    @PostMapping("/release")
    public ResponseEntity<Void> release(@RequestBody DeliveryAction action) {
        deliveryService.release(action.foodId, action.volunteerId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/deliver")
    public ResponseEntity<DeliveryResponse> deliver(@RequestBody DeliveryAction action) {
        return ResponseEntity.ok(deliveryService.deliver(action.foodId, action.volunteerId));
    }

    @GetMapping("/volunteer/{volunteerId}")
    public ResponseEntity<List<DeliveryResponse>> getByVolunteer(@PathVariable Long volunteerId) {
        return ResponseEntity.ok(deliveryService.getByVolunteer(volunteerId));
    }

    @Data
    private static class DeliveryAction {
        private Long foodId;
        private Long volunteerId;
    }
}