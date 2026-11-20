package com.socialthings.service;

import com.socialthings.domain.Product;
import com.socialthings.dto.product.ProductResponse;
import com.socialthings.exception.ApiException;
import com.socialthings.repository.OrderRepository;
import com.socialthings.repository.ProductRepository;
import com.socialthings.tracker.TrackerCatalogProduct;
import com.socialthings.tracker.TrackerCatalogService;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ProductService {

    /** A product is "new" for this long after it first appears in the tracker inventory. */
    static final Duration NEW_FOR = Duration.ofDays(14);
    /** How many of the most-ordered products are marked best-sellers. */
    static final int BEST_SELLER_COUNT = 3;

    private final ProductRepository productRepository;
    private final TrackerCatalogService trackerCatalogService;
    private final OrderRepository orderRepository;

    public ProductService(
            ProductRepository productRepository,
            TrackerCatalogService trackerCatalogService,
            OrderRepository orderRepository) {
        this.productRepository = productRepository;
        this.trackerCatalogService = trackerCatalogService;
        this.orderRepository = orderRepository;
    }

    public List<ProductResponse> findAll() {
        if (!trackerCatalogService.enabled()) {
            return List.of();
        }
        Set<String> bestSellers = bestSellerSlugs();
        Instant newSince = Instant.now().minus(NEW_FOR);
        return trackerCatalogService.listProducts().stream()
                .map(product -> toResponse(product, bestSellers, newSince))
                .toList();
    }

    public ProductResponse findBySlug(String slug) {
        if (!trackerCatalogService.enabled()) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Product not found");
        }
        return toResponse(trackerCatalogService.findBySlug(slug), bestSellerSlugs(), Instant.now().minus(NEW_FOR));
    }

    public Product findEntityById(Long id) {
        return productRepository
                .findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Unknown product: " + id));
    }

    /** Slugs of the most-ordered products (at least one unit sold). */
    private Set<String> bestSellerSlugs() {
        return orderRepository.unitsSoldBySlug(PageRequest.of(0, BEST_SELLER_COUNT)).stream()
                .filter(row -> row[0] != null && row[1] instanceof Number units && units.longValue() > 0)
                .map(row -> (String) row[0])
                .collect(Collectors.toSet());
    }

    private ProductResponse toResponse(TrackerCatalogProduct product, Set<String> bestSellers, Instant newSince) {
        Instant createdAt = product.createdAt();
        return new ProductResponse(
                product.slug(),
                product.name(),
                product.slug(),
                product.price().doubleValue(),
                product.description(),
                product.image(),
                product.colors(),
                product.sizes(),
                product.images(),
                createdAt != null && createdAt.isAfter(newSince),
                bestSellers.contains(product.slug()),
                createdAt != null ? createdAt.toString() : null);
    }
}
