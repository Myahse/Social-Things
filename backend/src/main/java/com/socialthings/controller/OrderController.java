package com.socialthings.controller;

import com.socialthings.dto.order.OrderResponse;
import com.socialthings.service.OrderService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<OrderResponse> myOrders() {
        return orderService.listMyOrders();
    }
}
