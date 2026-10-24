# FoodShare Notification Channels

This project now contains email, SMS (Twilio), and push (Firebase Cloud Messaging) sender classes.
The NotificationService selects a sender based on `channel` and stores `SENT` or `FAILED` in MySQL.

## Configure providers

### Email (Gmail SMTP)
Set environment variables before starting:
```bash
export MAIL_USERNAME="your-address@gmail.com"
export MAIL_PASSWORD="your-google-app-password"
```
Use a Google App Password; do not commit credentials. Export both variables in the
terminal that starts `Backend/start-all.sh` (or the notification service), so the
service process inherits them. The donor dashboard sends a `DONATION_CREATED`
email notification after the food service successfully creates a donation.

### SMS (Twilio)
Set:
```bash
export TWILIO_ACCOUNT_SID="your-twilio-account-sid"
export TWILIO_AUTH_TOKEN="your-twilio-auth-token"
export TWILIO_PHONE_NUMBER="+1xxxxxxxxxx"
```
Use a Twilio sender number and recipient phone number in international format.

### Push (Firebase Cloud Messaging)
Create a Firebase service-account key in Firebase Console and store it outside the repository. Then set:
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/absolute/path/to/service-account.json"
```
For `PUSH`, `recipient` must be the target device's FCM registration token. Do not commit the JSON key.

## Run
Start MySQL and Eureka if configured, then run:
```bash
./mvnw spring-boot:run
```
The Maven wrapper may need internet access on first use to download Maven.

## API
`POST http://localhost:8087/api/notifications`
```json
{
  "recipient": "your-address@gmail.com",
  "channel": "EMAIL",
  "eventType": "DONATION_CREATED",
  "message": "Your FoodShare donation has been created successfully."
}
```
Use `channel` values `EMAIL`, `SMS`, or `PUSH`. For SMS, recipient is a phone number; for PUSH, recipient is an FCM device token.
`GET http://localhost:8087/api/notifications` returns saved notification records.

Delivery is attempted synchronously. The record is saved first, and its status becomes `SENT` after provider acceptance or `FAILED` if the send fails. For production, add structured logging, retries, rate limiting, and authenticated service-to-service calls.
