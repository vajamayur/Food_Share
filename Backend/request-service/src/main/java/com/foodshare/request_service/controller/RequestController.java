package com.foodshare.request_service.controller;

import com.foodshare.request_service.dto.RequestRequest;
import com.foodshare.request_service.dto.RequestResponse;
import com.foodshare.request_service.service.RequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RequestController {

    private final RequestService requestService;

    @PostMapping
    public ResponseEntity<RequestResponse> createRequest(
            @Valid @RequestBody RequestRequest request) {

        return new ResponseEntity<>(
                requestService.createRequest(request),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<RequestResponse>> getAllRequests() {

        return ResponseEntity.ok(
                requestService.getAllRequests()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<RequestResponse> getRequestById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                requestService.getRequestById(id)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RequestResponse>> getRequestsByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                requestService.getRequestsByUser(userId)
        );
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<RequestResponse> acceptRequest(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                requestService.acceptRequest(id)
        );
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<RequestResponse> rejectRequest(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                requestService.rejectRequest(id)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRequest(
            @PathVariable Long id) {

        requestService.deleteRequest(id);

        return ResponseEntity.ok("Request deleted successfully");
    }
}