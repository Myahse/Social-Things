package com.socialthings.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.api")
public record ApiPublicProperties(String publicUrl) {

    public String origin() {
        if (publicUrl == null || publicUrl.isBlank()) {
            return "";
        }
        return publicUrl.replaceAll("/$", "").replaceAll("/api$", "");
    }
}
