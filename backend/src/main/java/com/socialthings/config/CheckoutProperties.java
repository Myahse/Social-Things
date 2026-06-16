package com.socialthings.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.checkout")
public record CheckoutProperties(boolean mockEnabled, String mockUrl) {}
