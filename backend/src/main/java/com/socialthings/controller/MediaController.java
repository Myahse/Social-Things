package com.socialthings.controller;

import com.socialthings.config.TrackerProperties;
import com.socialthings.tracker.TrackerInventoryRepository;
import java.net.URI;
import java.util.Base64;
import java.util.Optional;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/media")
public class MediaController {

    private final TrackerInventoryRepository inventoryRepository;
    private final TrackerProperties trackerProperties;

    public MediaController(
            TrackerInventoryRepository inventoryRepository, TrackerProperties trackerProperties) {
        this.inventoryRepository = inventoryRepository;
        this.trackerProperties = trackerProperties;
    }

    @GetMapping("/inventory/{id}")
    public ResponseEntity<byte[]> inventoryImage(@PathVariable String id) {
        return toResponse(inventoryRepository.findImageUrl(id));
    }

    @GetMapping("/inventory/{id}/gallery/{index}")
    public ResponseEntity<byte[]> inventoryGallery(@PathVariable String id, @PathVariable int index) {
        return toResponse(inventoryRepository.findGalleryUrl(id, index));
    }

    private ResponseEntity<byte[]> toResponse(Optional<String> raw) {
        if (raw.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String imageUrl = raw.get();
        if (imageUrl.contains("/api/public/inventory/")) {
            return ResponseEntity.notFound().build();
        }
        if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
            return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(imageUrl)).build();
        }
        if (imageUrl.startsWith("data:")) {
            return decodeDataUri(imageUrl);
        }
        String base = trackerProperties.publicBaseUrl();
        if (base != null && !base.isBlank()) {
            String absolute = base.replaceAll("/$", "") + (imageUrl.startsWith("/") ? imageUrl : "/" + imageUrl);
            return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(absolute)).build();
        }
        return ResponseEntity.notFound().build();
    }

    private static ResponseEntity<byte[]> decodeDataUri(String imageUrl) {
        int comma = imageUrl.indexOf(',');
        if (comma < 0) {
            return ResponseEntity.notFound().build();
        }
        String meta = imageUrl.substring(5, comma);
        String payload = imageUrl.substring(comma + 1);
        String contentType = meta.split(";", 2)[0];
        if (contentType.isBlank()) {
            contentType = MediaType.IMAGE_JPEG_VALUE;
        }
        try {
            byte[] bytes = Base64.getDecoder().decode(payload);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .cacheControl(CacheControl.maxAge(java.time.Duration.ofHours(6)).cachePublic())
                    .body(bytes);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
