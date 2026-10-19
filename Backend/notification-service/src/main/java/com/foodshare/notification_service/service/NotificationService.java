
package com.foodshare.notification_service.service;

import java.util.List;
import java.util.Locale;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.foodshare.notification_service.dto.NotificationRequest;
import com.foodshare.notification_service.entity.Notification;
import com.foodshare.notification_service.repository.NotificationRepository;

@Service
public class NotificationService {

    private final NotificationRepository repository;
    private final JavaMailSender mailSender;

    public NotificationService(
            NotificationRepository repository,
            JavaMailSender mailSender) {
        this.repository = repository;
        this.mailSender = mailSender;
    }

    public Notification send(NotificationRequest request) {

        String channel = request.getChannel()
                .toUpperCase(Locale.ROOT);

        Notification notification = new Notification();
        notification.setRecipient(request.getRecipient());
        notification.setChannel(channel);
        notification.setEventType(request.getEventType());
        notification.setMessage(request.getMessage());
        notification.setStatus("PENDING");

        notification = repository.save(notification);

        try {
            if ("EMAIL".equals(channel)) {
                SimpleMailMessage email = new SimpleMailMessage();
                email.setTo(request.getRecipient());
                email.setSubject(
                    "FoodShare: " + request.getEventType()
                );
                email.setText(request.getMessage());

                mailSender.send(email);
                notification.setStatus("SENT");

            } else if ("SMS".equals(channel)
                    || "PUSH".equals(channel)) {
                notification.setStatus("NOT_CONFIGURED");

            } else {
                notification.setStatus("FAILED");
            }

        } catch (Exception exception) {
            notification.setStatus("FAILED");
        }

        return repository.save(notification);
    }

    public List<Notification> getAll() {
        return repository.findAll();
    }
}
