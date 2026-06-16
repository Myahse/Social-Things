package com.socialthings.dto.product;

import java.util.List;

public record ProductResponse(
        String id,
        String name,
        String slug,
        double price,
        String description,
        String image,
        List<String> colors,
        List<String> sizes) {}
