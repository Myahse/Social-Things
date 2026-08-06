package com.socialthings.dto.order;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        String id,
        String status,
        BigDecimal subtotal,
        String currency,
        String checkoutUrl,
        String email,
        Instant createdAt,
        List<OrderItemResponse> items) {

    public record OrderItemResponse(
            String productId,
            String productSlug,
            String productName,
            String size,
            String color,
            int quantity,
            BigDecimal unitPrice) {}
}
