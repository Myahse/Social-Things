package com.socialthings.tracker;

import com.socialthings.config.ApiPublicProperties;
import com.socialthings.config.TrackerProperties;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class TrackerGalleryRepository {

    private final TrackerJdbc trackerJdbc;
    private final TrackerProperties trackerProperties;
    private final ApiPublicProperties apiPublicProperties;

    public TrackerGalleryRepository(
            TrackerJdbc trackerJdbc,
            TrackerProperties trackerProperties,
            ApiPublicProperties apiPublicProperties) {
        this.trackerJdbc = trackerJdbc;
        this.trackerProperties = trackerProperties;
        this.apiPublicProperties = apiPublicProperties;
    }

    public boolean available() {
        return trackerJdbc.available();
    }

    public List<TrackerGalleryItem> findAll() {
        if (!trackerJdbc.available()) {
            return List.of();
        }
        try {
            return trackerJdbc
                    .require()
                    .query(
                            """
                            SELECT id, group_id, alt,
                              CASE
                                WHEN image_url LIKE 'http%' AND image_url NOT LIKE '%data:%'
                                  THEN image_url
                                ELSE NULL
                              END AS image_url,
                              (image_url IS NOT NULL AND btrim(image_url) <> '') AS has_image
                            FROM gallery_images
                            WHERE image_url IS NOT NULL
                              AND btrim(image_url) <> ''
                            ORDER BY group_id ASC, sort_order ASC, created_at ASC
                            """,
                            rowMapper());
        } catch (Exception e) {
            return List.of();
        }
    }

    public Optional<String> findImageUrl(String id) {
        if (!trackerJdbc.available() || id == null || id.isBlank()) {
            return Optional.empty();
        }
        try {
            List<String> rows = trackerJdbc
                    .require()
                    .query(
                            "SELECT image_url FROM gallery_images WHERE id = ?",
                            (rs, rowNum) -> rs.getString("image_url"),
                            id);
            return rows.stream().filter(url -> url != null && !url.isBlank()).findFirst();
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    private RowMapper<TrackerGalleryItem> rowMapper() {
        return (rs, rowNum) -> {
            String id = rs.getString("id");
            boolean hasImage = rs.getBoolean("has_image");
            String imageUrl = rs.getString("image_url");
            String src = "";
            if (hasImage) {
                src = imageUrl == null || imageUrl.isBlank() ? mediaPath(id) : resolveImage(imageUrl, id);
            }
            return new TrackerGalleryItem(id, rs.getString("group_id"), src, rs.getString("alt"));
        };
    }

    private String resolveImage(String imageUrl, String id) {
        if (isExternalCdn(imageUrl)) {
            return imageUrl;
        }
        if (imageUrl.startsWith("data:") || isTrackerPublicProxy(imageUrl)) {
            return mediaPath(id);
        }
        String base = trackerProperties.publicBaseUrl();
        if (base == null || base.isBlank()) {
            return mediaPath(id);
        }
        return base.replaceAll("/$", "") + (imageUrl.startsWith("/") ? imageUrl : "/" + imageUrl);
    }

    private static boolean isExternalCdn(String imageUrl) {
        return (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"))
                && !isTrackerPublicProxy(imageUrl);
    }

    private static boolean isTrackerPublicProxy(String imageUrl) {
        return imageUrl.contains("/api/public/inventory/")
                || imageUrl.contains("/api/public/gallery/")
                || imageUrl.contains("/api/gallery/");
    }

    private String mediaPath(String id) {
        String path = "/api/media/gallery/" + id;
        String origin = apiPublicProperties.origin();
        if (origin.isBlank()) {
            return "/media/gallery/" + id;
        }
        return origin + path;
    }
}
