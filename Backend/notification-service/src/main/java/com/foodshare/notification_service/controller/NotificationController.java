package com.foodshare.notification_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodshare.notification_service.dto.NotificationRequest;
import com.foodshare.notification_service.entity.Notification;
import com.foodshare.notification_service.service.NotificationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @PostMapping
    public Notification create(
            @Valid @RequestBody NotificationRequest request) {
        return service.send(request);
    }

    @GetMapping
    public List<Notification> getAll() {
        return service.getAll();
    }
}
