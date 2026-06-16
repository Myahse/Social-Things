package com.socialthings.controller;

import com.socialthings.dto.product.ProductResponse;
import com.socialthings.service.ProductService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductResponse> listProducts() {
        return productService.findAll();
    }

    @GetMapping("/{slug}")
    public ProductResponse getProduct(@PathVariable String slug) {
        return productService.findBySlug(slug);
    }
}
