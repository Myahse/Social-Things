package com.socialthings.service;

import com.socialthings.domain.Order;
import com.socialthings.domain.User;
import com.socialthings.dto.order.OrderResponse;
import com.socialthings.exception.ApiException;
import com.socialthings.repository.OrderRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> listMyOrders() {
        User user = requireCurrentUser();
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    private User requireCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User user) {
            return user;
        }
        throw new ApiException(HttpStatus.UNAUTHORIZED, "Sign in to view orders");
    }

    private OrderResponse toResponse(Order order) {
        return new OrderResponse(
                order.getId().toString(),
                order.getStatus(),
                order.getSubtotal(),
                order.getCurrency(),
                order.getCheckoutUrl(),
                order.getEmail(),
                order.getCreatedAt(),
                order.getItems().stream()
                        .map(item -> new OrderResponse.OrderItemResponse(
                                String.valueOf(item.getProductId()),
                                item.getProductSlug(),
                                item.getProductName(),
                                item.getSize(),
                                item.getColor(),
                                item.getQuantity(),
                                item.getUnitPrice()))
                        .toList());
    }
}
