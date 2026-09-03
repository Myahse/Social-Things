package com.socialthings.tracker;

import java.math.BigDecimal;
import java.util.List;

public record TrackerInventoryItem(
        String id,
        String name,
        String sku,
        String category,
        String size,
        String color,
        String imageUrl,
        List<String> galleryUrls,
        BigDecimal price,
        int stock) {}
