package com.socialthings.service;

import com.socialthings.domain.Product;
import com.socialthings.dto.product.ProductResponse;
import com.socialthings.exception.ApiException;
import com.socialthings.repository.ProductRepository;
import com.socialthings.tracker.TrackerCatalogProduct;
import com.socialthings.tracker.TrackerCatalogService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final TrackerCatalogService trackerCatalogService;

    public ProductService(
            ProductRepository productRepository, TrackerCatalogService trackerCatalogService) {
        this.productRepository = productRepository;
        this.trackerCatalogService = trackerCatalogService;
    }

    public List<ProductResponse> findAll() {
        if (!trackerCatalogService.enabled()) {
            return List.of();
        }
        return trackerCatalogService.listProducts().stream().map(this::toResponse).toList();
    }

    public ProductResponse findBySlug(String slug) {
        if (!trackerCatalogService.enabled()) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Product not found");
        }
        return toResponse(trackerCatalogService.findBySlug(slug));
    }

    public Product findEntityById(Long id) {
        return productRepository
                .findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Unknown product: " + id));
    }

    private ProductResponse toResponse(TrackerCatalogProduct product) {
        return new ProductResponse(
                product.slug(),
                product.name(),
                product.slug(),
                product.price().doubleValue(),
                product.description(),
                product.image(),
                product.colors(),
                product.sizes(),
                product.images());
    }
}
