package com.socialthings.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.brevo")
public record BrevoProperties(
        String apiKey,
        String senderEmail,
        String senderName,
        Long templateWelcome,
        Long templateOrder,
        Long templateNewsletter,
        Long newsletterListId) {

    public boolean configured() {
        return apiKey != null && !apiKey.isBlank() && senderEmail != null && !senderEmail.isBlank();
    }

    public boolean hasTemplate(Long id) {
        return id != null && id > 0;
    }
}
