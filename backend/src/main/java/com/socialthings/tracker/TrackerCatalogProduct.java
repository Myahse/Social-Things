package com.socialthings.tracker;

import java.math.BigDecimal;
import java.util.List;

public record TrackerCatalogProduct(
        String slug,
        String name,
        String description,
        String image,
        BigDecimal price,
        List<String> colors,
        List<String> sizes) {}
