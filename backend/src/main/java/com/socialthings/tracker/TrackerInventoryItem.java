package com.socialthings.tracker;

import java.math.BigDecimal;

public record TrackerInventoryItem(
        String id,
        String name,
        String sku,
        String category,
        String size,
        String color,
        String imageUrl,
        BigDecimal price,
        int stock) {}
