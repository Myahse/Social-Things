package com.socialthings.tracker;

import com.socialthings.config.ApiPublicProperties;
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

    private static final long CATALOG_TTL_MS = 20_000;

    private final TrackerInventoryRepository inventoryRepository;
    private final TrackerProperties trackerProperties;
    private final ApiPublicProperties apiPublicProperties;
    private final Object catalogLock = new Object();
    private volatile Map<String, TrackerCatalogProduct> catalogCache = Map.of();
    private volatile long catalogCachedAt;
    private volatile boolean catalogReady;

    public TrackerCatalogService(
            TrackerInventoryRepository inventoryRepository,
            TrackerProperties trackerProperties,
            ApiPublicProperties apiPublicProperties) {
        this.inventoryRepository = inventoryRepository;
        this.trackerProperties = trackerProperties;
        this.apiPublicProperties = apiPublicProperties;
    }

    public boolean enabled() {
        return inventoryRepository.available();
    }

    public List<TrackerCatalogProduct> listProducts() {
        return List.copyOf(catalog().values());
    }

    public TrackerCatalogProduct findBySlug(String slug) {
        TrackerCatalogProduct product = catalog().get(slug);
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
        invalidate();
    }

    public void invalidate() {
        catalogCache = Map.of();
        catalogCachedAt = 0;
        catalogReady = false;
    }

    private Map<String, TrackerCatalogProduct> catalog() {
        long now = System.currentTimeMillis();
        Map<String, TrackerCatalogProduct> cached = catalogCache;
        if (catalogReady && now - catalogCachedAt < CATALOG_TTL_MS) {
            return cached;
        }
        synchronized (catalogLock) {
            cached = catalogCache;
            if (catalogReady && now - catalogCachedAt < CATALOG_TTL_MS) {
                return cached;
            }
            Map<String, TrackerCatalogProduct> next = group(inventoryRepository.findAll());
            catalogCache = next;
            catalogCachedAt = System.currentTimeMillis();
            catalogReady = true;
            return next;
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
            Set<String> images = new LinkedHashSet<>();
            BigDecimal price = first.price();
            for (TrackerInventoryItem variant : variants) {
                colors.add(variant.color() == null || variant.color().isBlank() ? "Default" : variant.color());
                sizes.add(variant.size() == null || variant.size().isBlank() ? "OS" : variant.size());
                if (variant.imageUrl() != null && !variant.imageUrl().isBlank()) {
                    images.add(resolveImage(variant.imageUrl(), variant.id(), -1));
                } else if (variant.hasImage()) {
                    images.add(mediaPath(variant.id(), -1));
                }
                if (variant.galleryUrls() != null && !variant.galleryUrls().isEmpty()) {
                    for (String extra : variant.galleryUrls()) {
                        if (extra != null && !extra.isBlank()) {
                            images.add(resolveImage(extra, variant.id(), -1));
                        }
                    }
                } else {
                    for (int i = 0; i < variant.galleryCount(); i++) {
                        images.add(mediaPath(variant.id(), i));
                    }
                }
            }
            String image = images.isEmpty() ? "" : images.iterator().next();
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
                            List.copyOf(images),
                            price,
                            List.copyOf(colors),
                            List.copyOf(sizes)));
        });
        return products;
    }

    private String resolveImage(String imageUrl, String itemId, int galleryIndex) {
        if (isExternalCdn(imageUrl)) {
            return imageUrl;
        }
        if (imageUrl.startsWith("data:") || isTrackerPublicProxy(imageUrl)) {
            return mediaPath(itemId, galleryIndex);
        }
        String base = trackerProperties.publicBaseUrl();
        if (base == null || base.isBlank()) {
            return mediaPath(itemId, galleryIndex);
        }
        return base.replaceAll("/$", "") + (imageUrl.startsWith("/") ? imageUrl : "/" + imageUrl);
    }

    private static boolean isExternalCdn(String imageUrl) {
        return (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"))
                && !isTrackerPublicProxy(imageUrl);
    }

    private static boolean isTrackerPublicProxy(String imageUrl) {
        return imageUrl.contains("/api/public/inventory/");
    }

    private String mediaPath(String itemId, int galleryIndex) {
        String path = galleryIndex >= 0
                ? "/api/media/inventory/" + itemId + "/gallery/" + galleryIndex
                : "/api/media/inventory/" + itemId;
        String origin = apiPublicProperties.origin();
        if (origin.isBlank()) {
            return path.startsWith("/api") ? path.substring(4) : path;
        }
        return origin + path;
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
