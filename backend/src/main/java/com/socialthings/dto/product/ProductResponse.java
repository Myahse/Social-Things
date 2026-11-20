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
        List<String> sizes,
        List<String> images,
        /** First added to the inventory within the last 14 days. */
        boolean newArrival,
        /** Among the top sellers by units ordered. */
        boolean bestSeller,
        /** ISO-8601, or null when unknown. */
        String createdAt) {}
