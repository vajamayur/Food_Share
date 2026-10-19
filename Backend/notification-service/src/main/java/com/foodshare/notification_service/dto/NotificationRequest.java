
package com.foodshare.notification_service.dto;

import jakarta.validation.constraints.NotBlank;

public class NotificationRequest {

    @NotBlank
    private String recipient;

    @NotBlank
    private String channel;

    @NotBlank
    private String eventType;

    @NotBlank
    private String message;

    public String getRecipient() { return recipient; }
    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    public String getChannel() { return channel; }
    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) {
        this.message = message;
    }
}
    