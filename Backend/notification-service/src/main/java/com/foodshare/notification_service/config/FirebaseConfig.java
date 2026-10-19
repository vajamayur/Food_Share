package com.foodshare.notification_service.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initializeFirebase() throws IOException {
        // Firebase is optional during local development. If credentials are
        // configured, initialize the Admin SDK once at application startup.
        if (FirebaseApp.getApps().isEmpty()
                && System.getenv("GOOGLE_APPLICATION_CREDENTIALS") != null
                && !System.getenv("GOOGLE_APPLICATION_CREDENTIALS").isBlank()) {
            FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.getApplicationDefault())
                .build();
            FirebaseApp.initializeApp(options);
        }
    }
}
