package com.socialthings.tracker;

import com.socialthings.config.TrackerProperties;
import com.socialthings.exception.ApiException;
import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class TrackerCatalogService {

    private final TrackerInventoryRepository inventoryRepository;
    private final TrackerProperties trackerProperties;

    public TrackerCatalogService(
            TrackerInventoryRepository inventoryRepository, TrackerProperties trackerProperties) {
        this.inventoryRepository = inventoryRepository;
        this.trackerProperties = trackerProperties;
    }

    public boolean enabled() {
        return inventoryRepository.available();
    }

    public List<TrackerCatalogProduct> listProducts() {
        return group(inventoryRepository.findAll()).values().stream().toList();
    }

    public TrackerCatalogProduct findBySlug(String slug) {
        TrackerCatalogProduct product = group(inventoryRepository.findAll()).get(slug);
        if (product == null) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Product not found");
        }
        return product;
    }

    public TrackerInventoryItem requireVariant(String slug, String size, String color) {
        TrackerCatalogProduct product = findBySlug(slug);
        TrackerInventoryItem item = inventoryRepository
                .findVariant(product.name(), size, color)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.BAD_REQUEST,
                        "That size or color is not in tracker inventory"));
        if (item.stock() <= 0) {
            throw new ApiException(HttpStatus.CONFLICT, product.name() + " is out of stock");
        }
        return item;
    }

    public void decrementStock(String inventoryId, int quantity, String productName) {
        if (!inventoryRepository.decrementStock(inventoryId, quantity)) {
            throw new ApiException(HttpStatus.CONFLICT, "Not enough stock for " + productName);
        }
    }

    private Map<String, TrackerCatalogProduct> group(List<TrackerInventoryItem> items) {
        Map<String, List<TrackerInventoryItem>> bySlug = new LinkedHashMap<>();
        for (TrackerInventoryItem item : items) {
            if (item.name() == null || item.name().isBlank()) {
                continue;
            }
            if (item.stock() <= 0) {
                continue;
            }
            bySlug.computeIfAbsent(slugify(item.name()), key -> new ArrayList<>()).add(item);
        }

        Map<String, TrackerCatalogProduct> products = new LinkedHashMap<>();
        bySlug.forEach((slug, variants) -> {
            TrackerInventoryItem first = variants.get(0);
            Set<String> colors = new LinkedHashSet<>();
            Set<String> sizes = new LinkedHashSet<>();
            String image = "";
            BigDecimal price = first.price();
            for (TrackerInventoryItem variant : variants) {
                colors.add(variant.color() == null || variant.color().isBlank() ? "Default" : variant.color());
                sizes.add(variant.size() == null || variant.size().isBlank() ? "OS" : variant.size());
                if (image.isBlank() && variant.imageUrl() != null && !variant.imageUrl().isBlank()) {
                    image = resolveImage(variant.imageUrl());
                }
            }
            String category = first.category() == null || first.category().isBlank()
                    ? "SOCIAL THINGS"
                    : first.category();
            products.put(
                    slug,
                    new TrackerCatalogProduct(
                            slug,
                            first.name(),
                            category,
                            image,
                            price,
                            List.copyOf(colors),
                            List.copyOf(sizes)));
        });
        return products;
    }

    private String resolveImage(String imageUrl) {
        if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://") || imageUrl.startsWith("data:")) {
            return imageUrl;
        }
        String base = trackerProperties.publicBaseUrl();
        if (base == null || base.isBlank()) {
            return imageUrl;
        }
        return base.replaceAll("/$", "") + (imageUrl.startsWith("/") ? imageUrl : "/" + imageUrl);
    }

    static String slugify(String name) {
        String normalized = Normalizer.normalize(name, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-+|-+$", "");
        return normalized.isBlank() ? "item" : normalized;
    }
}
