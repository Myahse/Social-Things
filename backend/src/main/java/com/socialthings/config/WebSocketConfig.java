package com.socialthings.config;

import com.socialthings.ws.CatalogWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final CatalogWebSocketHandler catalogWebSocketHandler;

    public WebSocketConfig(CatalogWebSocketHandler catalogWebSocketHandler) {
        this.catalogWebSocketHandler = catalogWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(catalogWebSocketHandler, "/ws/catalog").setAllowedOriginPatterns("*");
    }
}
