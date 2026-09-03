package com.socialthings.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.tracker")
public record TrackerProperties(String url, String username, String password, String publicBaseUrl) {

    public boolean configured() {
        return url != null && !url.isBlank();
    }
}
