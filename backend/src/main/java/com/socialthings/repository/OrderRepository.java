package com.socialthings.repository;

import com.socialthings.domain.Order;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findByUserIdOrderByCreatedAtDesc(UUID userId);

    List<Order> findByEmailIgnoreCaseOrderByCreatedAtDesc(String email);

    /** [productSlug, unitsSold] for every ordered product, best first (cancelled, failed and refunded orders left out). */
    @Query("""
            select i.productSlug, sum(i.quantity)
            from OrderItem i
            where upper(i.order.status) not in ('CANCELLED', 'CANCELED', 'FAILED', 'REFUNDED')
            group by i.productSlug
            order by sum(i.quantity) desc
            """)
    List<Object[]> unitsSoldBySlug(Pageable pageable);
}
