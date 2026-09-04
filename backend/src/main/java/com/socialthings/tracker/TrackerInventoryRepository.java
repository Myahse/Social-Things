package com.socialthings.tracker;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class TrackerInventoryRepository {

    private static final ObjectMapper GALLERY_MAPPER = new ObjectMapper();
    private static final TypeReference<List<String>> GALLERY_TYPE = new TypeReference<List<String>>() {};

    private static final String CATALOG_COLS =
            """
            id, name, sku, category, size, color, price, stock,
            CASE WHEN image_url LIKE 'data:%' THEN NULL ELSE image_url END AS image_url,
            CASE WHEN coalesce(gallery_urls, '') LIKE '%data:%' THEN NULL ELSE gallery_urls END AS gallery_urls
            """;

    private final TrackerJdbc trackerJdbc;

    public TrackerInventoryRepository(TrackerJdbc trackerJdbc) {
        this.trackerJdbc = trackerJdbc;
    }

    public boolean available() {
        return trackerJdbc.available();
    }

    public List<TrackerInventoryItem> findAll() {
        return trackerJdbc
                .require()
                .query(
                        "SELECT " + CATALOG_COLS + " FROM inventory_items ORDER BY name ASC, created_at ASC",
                        rowMapper());
    }

    public Optional<TrackerInventoryItem> findVariant(String name, String size, String color) {
        List<TrackerInventoryItem> rows = trackerJdbc
                .require()
                .query(
                        """
                        SELECT id, name, sku, category, size, color, NULL AS image_url, NULL AS gallery_urls, price, stock
                        FROM inventory_items
                        WHERE lower(trim(name)) = lower(trim(?))
                          AND lower(trim(coalesce(nullif(size, ''), 'OS'))) = lower(trim(?))
                          AND lower(trim(coalesce(nullif(color, ''), 'Default'))) = lower(trim(?))
                        LIMIT 1
                        """,
                        rowMapper(),
                        name,
                        size,
                        color);
        return rows.stream().findFirst();
    }

    public boolean decrementStock(String id, int quantity) {
        int updated = trackerJdbc
                .require()
                .update(
                        """
                        UPDATE inventory_items
                        SET stock = stock - ?, updated_at = now()
                        WHERE id = ? AND stock >= ?
                        """,
                        quantity,
                        id,
                        quantity);
        return updated == 1;
    }

    static List<String> parseGalleryUrls(String raw) {
        if (raw == null || raw.isBlank()) {
            return List.of();
        }
        try {
            List<String> parsed = GALLERY_MAPPER.readValue(raw.trim(), GALLERY_TYPE);
            if (parsed == null) {
                return List.of();
            }
            return parsed.stream().filter(url -> url != null && !url.isBlank()).toList();
        } catch (Exception e) {
            return List.of();
        }
    }

    private static RowMapper<TrackerInventoryItem> rowMapper() {
        return (rs, rowNum) -> new TrackerInventoryItem(
                rs.getString("id"),
                rs.getString("name"),
                rs.getString("sku"),
                rs.getString("category"),
                rs.getString("size"),
                rs.getString("color"),
                rs.getString("image_url"),
                parseGalleryUrls(rs.getString("gallery_urls")),
                rs.getBigDecimal("price") != null ? rs.getBigDecimal("price") : BigDecimal.ZERO,
                rs.getInt("stock"));
    }
}
