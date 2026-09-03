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
        if (trackerCatalogService.enabled()) {
            return trackerCatalogService.listProducts().stream().map(this::toResponse).toList();
        }
        return productRepository.findAll().stream().map(this::toResponse).toList();
    }

    public ProductResponse findBySlug(String slug) {
        if (trackerCatalogService.enabled()) {
            return toResponse(trackerCatalogService.findBySlug(slug));
        }
        return productRepository
                .findBySlug(slug)
                .map(this::toResponse)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));
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

    private ProductResponse toResponse(Product product) {
        String image = product.getImage();
        List<String> images = image == null || image.isBlank() ? List.of() : List.of(image);
        return new ProductResponse(
                String.valueOf(product.getId()),
                product.getName(),
                product.getSlug(),
                product.getPrice().doubleValue(),
                product.getDescription(),
                image,
                product.getColors(),
                product.getSizes(),
                images);
    }
}
