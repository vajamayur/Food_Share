package com.foodshare.notification_service.repository;

import com.foodshare.notification_service.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {
}