package com.socialthings.controller;

import com.socialthings.ws.CatalogRealtimeService;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/catalog")
public class CatalogRefreshController {

    private final CatalogRealtimeService catalogRealtimeService;

    public CatalogRefreshController(CatalogRealtimeService catalogRealtimeService) {
        this.catalogRealtimeService = catalogRealtimeService;
    }

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refresh(@RequestBody(required = false) Map<String, String> body) {
        String reason = body != null && body.get("reason") != null ? body.get("reason") : "inventory.changed";
        catalogRealtimeService.notifyChanged(reason);
        return ResponseEntity.ok(Map.of("status", "ok", "reason", reason));
    }
}
