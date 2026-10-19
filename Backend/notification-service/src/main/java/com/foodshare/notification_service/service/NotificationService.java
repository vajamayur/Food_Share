package com.foodshare.notification_service.service;

import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;

import com.foodshare.notification_service.channel.EmailNotificationSender;
import com.foodshare.notification_service.channel.PushNotificationSender;
import com.foodshare.notification_service.channel.SmsNotificationSender;
import com.foodshare.notification_service.dto.NotificationRequest;
import com.foodshare.notification_service.entity.Notification;
import com.foodshare.notification_service.repository.NotificationRepository;

@Service
public class NotificationService {

    private final NotificationRepository repository;
    private final EmailNotificationSender emailSender;
    private final SmsNotificationSender smsSender;
    private final PushNotificationSender pushSender;

    public NotificationService(
            NotificationRepository repository,
            EmailNotificationSender emailSender,
            SmsNotificationSender smsSender,
            PushNotificationSender pushSender) {
        this.repository = repository;
        this.emailSender = emailSender;
        this.smsSender = smsSender;
        this.pushSender = pushSender;
    }

    public Notification send(NotificationRequest request) {
        String channel = request.getChannel().trim().toUpperCase(Locale.ROOT);

        Notification notification = new Notification();
        notification.setRecipient(request.getRecipient());
        notification.setChannel(channel);
        notification.setEventType(request.getEventType());
        notification.setMessage(request.getMessage());
        notification.setStatus("PENDING");

        // Save first so a record exists even if an external provider fails.
        notification = repository.save(notification);

        try {
            String subject = "FoodShare: " + request.getEventType();

            switch (channel) {
                case "EMAIL":
                    emailSender.sendEmail(
                        request.getRecipient(), subject, request.getMessage());
                    break;
                case "SMS":
                    smsSender.sendSms(
                        request.getRecipient(), request.getMessage());
                    break;
                case "PUSH":
                    // For PUSH, recipient must be an FCM device registration token.
                    pushSender.sendPush(
                        request.getRecipient(), subject, request.getMessage());
                    break;
                default:
                    throw new IllegalArgumentException(
                        "Unsupported notification channel: " + channel);
            }

            notification.setStatus("SENT");
        } catch (Exception exception) {
            notification.setStatus("FAILED");
            // Keep provider details in server logs, not in the API response.
            System.err.println("Notification delivery failed for id "
                + notification.getId() + ": " + exception.getMessage());
        }

        return repository.save(notification);
    }

    public List<Notification> getAll() {
        return repository.findAll();
    }
}
