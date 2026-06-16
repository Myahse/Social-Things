package com.socialthings.service;

import com.socialthings.domain.Product;
import com.socialthings.dto.product.ProductResponse;
import com.socialthings.exception.ApiException;
import com.socialthings.repository.ProductRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductResponse> findAll() {
        return productRepository.findAll().stream().map(this::toResponse).toList();
    }

    public ProductResponse findBySlug(String slug) {
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

    private ProductResponse toResponse(Product product) {
        return new ProductResponse(
                String.valueOf(product.getId()),
                product.getName(),
                product.getSlug(),
                product.getPrice().doubleValue(),
                product.getDescription(),
                product.getImage(),
                product.getColors(),
                product.getSizes());
    }
}
