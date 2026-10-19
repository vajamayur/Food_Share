package com.foodshare.notification_service.channel;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsNotificationSender {

    @Value("${twilio.account-sid:}")
    private String accountSid;

    @Value("${twilio.auth-token:}")
    private String authToken;

    @Value("${twilio.phone-number:}")
    private String fromNumber;

    public void sendSms(String recipient, String message) {
        if (accountSid.isBlank() || authToken.isBlank() || fromNumber.isBlank()) {
            throw new IllegalStateException(
                "Twilio is not configured. Set TWILIO_ACCOUNT_SID, "
                + "TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER."
            );
        }

        Twilio.init(accountSid, authToken);
        Message.creator(
            new PhoneNumber(recipient),
            new PhoneNumber(fromNumber),
            message
        ).create();
    }
}
