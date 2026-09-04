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
            CASE WHEN image_url LIKE 'http%' THEN image_url ELSE NULL END AS image_url,
            (image_url IS NOT NULL AND btrim(image_url) <> '') AS has_image,
            CASE
              WHEN gallery_urls LIKE '%http%' AND gallery_urls NOT LIKE '%data:%' THEN gallery_urls
              ELSE NULL
            END AS gallery_urls,
            CASE
              WHEN gallery_urls IS NULL OR btrim(gallery_urls) IN ('', '[]', 'null') THEN 0
              WHEN gallery_urls ~ '^\\s*\\[' THEN COALESCE(jsonb_array_length(gallery_urls::jsonb), 0)
              ELSE 0
            END AS gallery_count
            """;

    private final TrackerJdbc trackerJdbc;

    public TrackerInventoryRepository(TrackerJdbc trackerJdbc) {
        this.trackerJdbc = trackerJdbc;
    }

    public boolean available() {
        return trackerJdbc.available();
    }

    public List<TrackerInventoryItem> findAll() {
        try {
            return trackerJdbc
                    .require()
                    .query(
                            "SELECT " + CATALOG_COLS + " FROM inventory_items ORDER BY name ASC, created_at ASC",
                            rowMapper());
        } catch (Exception e) {
            return trackerJdbc
                    .require()
                    .query(
                            """
                            SELECT id, name, sku, category, size, color, price, stock,
                              CASE WHEN image_url LIKE 'http%' THEN image_url ELSE NULL END AS image_url,
                              (image_url IS NOT NULL AND btrim(image_url) <> '') AS has_image,
                              NULL AS gallery_urls,
                              CASE WHEN gallery_urls IS NULL OR btrim(gallery_urls) IN ('', '[]', 'null') THEN 0 ELSE 1 END AS gallery_count
                            FROM inventory_items
                            ORDER BY name ASC, created_at ASC
                            """,
                            rowMapper());
        }
    }

    public Optional<String> findImageUrl(String id) {
        List<String> rows = trackerJdbc
                .require()
                .query(
                        "SELECT image_url FROM inventory_items WHERE id = ?",
                        (rs, rowNum) -> rs.getString("image_url"),
                        id);
        return rows.stream().filter(url -> url != null && !url.isBlank()).findFirst();
    }

    public Optional<String> findGalleryUrl(String id, int index) {
        if (index < 0) {
            return Optional.empty();
        }
        List<String> rows = trackerJdbc
                .require()
                .query(
                        "SELECT gallery_urls FROM inventory_items WHERE id = ?",
                        (rs, rowNum) -> rs.getString("gallery_urls"),
                        id);
        if (rows.isEmpty()) {
            return Optional.empty();
        }
        List<String> gallery = parseGalleryUrls(rows.get(0));
        if (index >= gallery.size()) {
            return Optional.empty();
        }
        return Optional.of(gallery.get(index));
    }

    public Optional<TrackerInventoryItem> findVariant(String name, String size, String color) {
        List<TrackerInventoryItem> rows = trackerJdbc
                .require()
                .query(
                        """
                        SELECT id, name, sku, category, size, color, NULL AS image_url, false AS has_image,
                               NULL AS gallery_urls, 0 AS gallery_count, price, stock
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
                rs.getBoolean("has_image"),
                parseGalleryUrls(rs.getString("gallery_urls")),
                rs.getInt("gallery_count"),
                rs.getBigDecimal("price") != null ? rs.getBigDecimal("price") : BigDecimal.ZERO,
                rs.getInt("stock"));
    }
}
