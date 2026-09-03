package com.socialthings.tracker;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.socialthings.config.TrackerProperties;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.stereotype.Repository;

@Repository
public class TrackerInventoryRepository {

    private static final ObjectMapper GALLERY_MAPPER = new ObjectMapper();
    private static final TypeReference<List<String>> GALLERY_TYPE = new TypeReference<List<String>>() {};

    private final JdbcTemplate jdbc;

    public TrackerInventoryRepository(TrackerProperties properties) {
        if (!properties.configured()) {
            this.jdbc = null;
            return;
        }
        this.jdbc = new JdbcTemplate(dataSource(properties));
        try {
            this.jdbc.execute("ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS gallery_urls TEXT");
        } catch (Exception ignored) {
            // Shop still works after the tracker migration adds the column.
        }
    }

    public boolean available() {
        return jdbc != null;
    }

    public List<TrackerInventoryItem> findAll() {
        requireJdbc();
        return jdbc.query(
                """
                SELECT id, name, sku, category, size, color, image_url, gallery_urls, price, stock
                FROM inventory_items
                ORDER BY name ASC, created_at ASC
                """,
                rowMapper());
    }

    public Optional<TrackerInventoryItem> findVariant(String name, String size, String color) {
        requireJdbc();
        List<TrackerInventoryItem> rows = jdbc.query(
                """
                SELECT id, name, sku, category, size, color, image_url, gallery_urls, price, stock
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
        requireJdbc();
        int updated = jdbc.update(
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

    private void requireJdbc() {
        if (jdbc == null) {
            throw new IllegalStateException("Tracker inventory database is not configured");
        }
    }

    private static DataSource dataSource(TrackerProperties properties) {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("org.postgresql.Driver");
        dataSource.setUrl(properties.url());
        dataSource.setUsername(properties.username());
        dataSource.setPassword(properties.password());
        return dataSource;
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
