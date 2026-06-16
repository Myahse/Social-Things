package com.socialthings.service;

import com.socialthings.config.CheckoutProperties;
import com.socialthings.domain.Product;
import com.socialthings.dto.checkout.CheckoutRequest;
import com.socialthings.dto.checkout.CheckoutResponse;
import com.socialthings.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class CheckoutService {

    private final ProductService productService;
    private final CheckoutProperties checkoutProperties;

    public CheckoutService(ProductService productService, CheckoutProperties checkoutProperties) {
        this.productService = productService;
        this.checkoutProperties = checkoutProperties;
    }

    public CheckoutResponse createCheckout(CheckoutRequest request) {
        for (CheckoutRequest.CheckoutLineRequest line : request.items()) {
            Product product = productService.findEntityById(parseProductId(line.productId()));
            validateVariant(product, line.size(), line.color());
        }

        if (checkoutProperties.mockEnabled()) {
            return new CheckoutResponse(checkoutProperties.mockUrl());
        }

        throw new ApiException(
                HttpStatus.SERVICE_UNAVAILABLE,
                "Shopify checkout is not configured. Set CHECKOUT_MOCK_ENABLED=true for development.");
    }

    private Long parseProductId(String productId) {
        try {
            return Long.parseLong(productId);
        } catch (NumberFormatException ex) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid product id: " + productId);
        }
    }

    private void validateVariant(Product product, String size, String color) {
        if (!product.getSizes().contains(size)) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid size \"" + size + "\" for product " + product.getSlug());
        }
        if (!product.getColors().contains(color)) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid color \"" + color + "\" for product " + product.getSlug());
        }
    }
}
