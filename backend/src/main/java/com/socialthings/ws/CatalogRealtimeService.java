package com.socialthings.ws;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.socialthings.tracker.TrackerCatalogService;
import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

@Service
public class CatalogRealtimeService {

    private static final Logger log = LoggerFactory.getLogger(CatalogRealtimeService.class);

    private final Set<WebSocketSession> sessions = ConcurrentHashMap.newKeySet();
    private final TrackerCatalogService trackerCatalogService;
    private final ObjectMapper objectMapper;

    public CatalogRealtimeService(TrackerCatalogService trackerCatalogService, ObjectMapper objectMapper) {
        this.trackerCatalogService = trackerCatalogService;
        this.objectMapper = objectMapper;
    }

    public void register(WebSocketSession session) {
        sessions.add(session);
    }

    public void unregister(WebSocketSession session) {
        sessions.remove(session);
    }

    public void notifyChanged(String reason) {
        trackerCatalogService.invalidate();
        String payload;
        try {
            payload = objectMapper.writeValueAsString(Map.of(
                    "type", "catalog.changed",
                    "reason", reason == null || reason.isBlank() ? "updated" : reason));
        } catch (IOException e) {
            payload = "{\"type\":\"catalog.changed\"}";
        }

        TextMessage message = new TextMessage(payload);
        for (WebSocketSession session : sessions) {
            if (!session.isOpen()) {
                sessions.remove(session);
                continue;
            }
            try {
                synchronized (session) {
                    session.sendMessage(message);
                }
            } catch (Exception e) {
                log.debug("Catalog socket send failed: {}", e.getMessage());
                sessions.remove(session);
            }
        }
    }
}
