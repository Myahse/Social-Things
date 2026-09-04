package com.socialthings.service;

import com.socialthings.config.StorefrontProperties;
import com.socialthings.domain.Order;
import com.socialthings.domain.OrderItem;
import com.socialthings.domain.Product;
import com.socialthings.domain.User;
import com.socialthings.dto.checkout.CheckoutRequest;
import com.socialthings.dto.checkout.CheckoutResponse;
import com.socialthings.exception.ApiException;
import com.socialthings.repository.OrderRepository;
import com.socialthings.tracker.TrackerCatalogService;
import com.socialthings.tracker.TrackerInventoryItem;
import com.socialthings.ws.CatalogRealtimeService;
import java.math.BigDecimal;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CheckoutService {

    private final ProductService productService;
    private final OrderRepository orderRepository;
    private final TrackerCatalogService trackerCatalogService;
    private final StorefrontProperties storefrontProperties;
    private final CatalogRealtimeService catalogRealtimeService;

    public CheckoutService(
            ProductService productService,
            OrderRepository orderRepository,
            TrackerCatalogService trackerCatalogService,
            StorefrontProperties storefrontProperties,
            CatalogRealtimeService catalogRealtimeService) {
        this.productService = productService;
        this.orderRepository = orderRepository;
        this.trackerCatalogService = trackerCatalogService;
        this.storefrontProperties = storefrontProperties;
        this.catalogRealtimeService = catalogRealtimeService;
    }

    @Transactional
    public CheckoutResponse createCheckout(CheckoutRequest request) {
        Order order = new Order();
        User currentUser = currentUser();
        if (currentUser != null) {
            order.setUserId(currentUser.getId());
            order.setEmail(currentUser.getEmail());
        } else if (request.email() != null && !request.email().isBlank()) {
            order.setEmail(request.email().trim());
        }

        if (request.shipping() != null) {
            order.setShippingName(request.shipping().name());
            order.setShippingLine1(request.shipping().line1());
            order.setShippingCity(request.shipping().city());
            order.setShippingRegion(request.shipping().region());
            order.setShippingPostal(request.shipping().postal());
            order.setShippingCountry(request.shipping().country());
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        if (trackerCatalogService.enabled()) {
            for (CheckoutRequest.CheckoutLineRequest line : request.items()) {
                TrackerInventoryItem variant =
                        trackerCatalogService.requireVariant(line.productId(), line.size(), line.color());
                if (variant.stock() < line.quantity()) {
                    throw new ApiException(
                            HttpStatus.CONFLICT, "Not enough stock for " + variant.name());
                }
                trackerCatalogService.decrementStock(variant.id(), line.quantity(), variant.name());

                OrderItem item = new OrderItem();
                item.setProductId(syntheticId(variant.id()));
                item.setProductSlug(line.productId());
                item.setProductName(variant.name());
                item.setSize(line.size());
                item.setColor(line.color());
                item.setQuantity(line.quantity());
                item.setUnitPrice(variant.price());
                order.addItem(item);
                subtotal = subtotal.add(variant.price().multiply(BigDecimal.valueOf(line.quantity())));
            }
        } else {
            for (CheckoutRequest.CheckoutLineRequest line : request.items()) {
                Product product = productService.findEntityById(parseProductId(line.productId()));
                validateVariant(product, line.size(), line.color());

                OrderItem item = new OrderItem();
                item.setProductId(product.getId());
                item.setProductSlug(product.getSlug());
                item.setProductName(product.getName());
                item.setSize(line.size());
                item.setColor(line.color());
                item.setQuantity(line.quantity());
                item.setUnitPrice(product.getPrice());
                order.addItem(item);
                subtotal = subtotal.add(product.getPrice().multiply(BigDecimal.valueOf(line.quantity())));
            }
        }

        order.setSubtotal(subtotal);
        order.setStatus("CONFIRMED");
        Order saved = orderRepository.save(order);
        String checkoutUrl = storefrontUrl() + "/order/" + saved.getId();
        saved.setCheckoutUrl(checkoutUrl);
        saved = orderRepository.save(saved);
        if (trackerCatalogService.enabled()) {
            catalogRealtimeService.notifyChanged("stock.changed");
        }
        return new CheckoutResponse(checkoutUrl, saved.getId().toString());
    }

    private String storefrontUrl() {
        String url = storefrontProperties.url();
        if (url == null || url.isBlank()) {
            return "http://localhost:5173";
        }
        return url.replaceAll("/$", "");
    }

    private static long syntheticId(String inventoryId) {
        return Math.abs((long) inventoryId.hashCode());
    }

    private User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User user) {
            return user;
        }
        return null;
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
