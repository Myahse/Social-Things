package com.socialthings.ws;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class CatalogWebSocketHandler extends TextWebSocketHandler {

    private final CatalogRealtimeService catalogRealtimeService;
    private final ObjectMapper objectMapper;

    public CatalogWebSocketHandler(CatalogRealtimeService catalogRealtimeService, ObjectMapper objectMapper) {
        this.catalogRealtimeService = catalogRealtimeService;
        this.objectMapper = objectMapper;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        catalogRealtimeService.register(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        catalogRealtimeService.unregister(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        String type = readType(message.getPayload());
        if ("inventory.changed".equals(type)
                || "catalog.refresh".equals(type)
                || "catalog.changed".equals(type)
                || "gallery.changed".equals(type)) {
            catalogRealtimeService.notifyChanged(type);
        }
    }

    private String readType(String payload) {
        try {
            JsonNode node = objectMapper.readTree(payload);
            return node.path("type").asText("");
        } catch (Exception e) {
            return "";
        }
    }
}
