package com.socialthings.tracker;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record TrackerInventoryItem(
        String id,
        String name,
        String sku,
        String category,
        String size,
        String color,
        String imageUrl,
        boolean hasImage,
        List<String> galleryUrls,
        int galleryCount,
        BigDecimal price,
        int stock,
        /** When the row was added in the tracker; null if unknown. */
        Instant createdAt) {}
