package com.socialthings.repository;

import com.socialthings.domain.Order;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findByUserIdOrderByCreatedAtDesc(UUID userId);

    List<Order> findByEmailIgnoreCaseOrderByCreatedAtDesc(String email);
}
