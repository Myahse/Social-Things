package com.socialthings.tracker;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record TrackerCatalogProduct(
        String slug,
        String name,
        String description,
        String image,
        List<String> images,
        BigDecimal price,
        List<String> colors,
        List<String> sizes,
        /** Earliest created_at among the product's variants (first time it appeared); null if unknown. */
        Instant createdAt) {}
