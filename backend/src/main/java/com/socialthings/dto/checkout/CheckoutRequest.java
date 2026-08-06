package com.socialthings.dto.checkout;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record CheckoutRequest(
        @NotEmpty @Valid List<CheckoutLineRequest> items,
        @Email String email,
        ShippingAddress shipping) {

    public record CheckoutLineRequest(
            @NotBlank String productId,
            @NotBlank String size,
            @NotBlank String color,
            @NotNull @Min(1) Integer quantity) {}

    public record ShippingAddress(
            String name,
            String line1,
            String city,
            String region,
            String postal,
            String country) {}
}
