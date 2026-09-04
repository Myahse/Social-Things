package com.socialthings.tracker;

import com.socialthings.config.TrackerProperties;
import java.util.List;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class TrackerGalleryRepository {

    private final TrackerJdbc trackerJdbc;
    private final TrackerProperties trackerProperties;

    public TrackerGalleryRepository(TrackerJdbc trackerJdbc, TrackerProperties trackerProperties) {
        this.trackerJdbc = trackerJdbc;
        this.trackerProperties = trackerProperties;
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
                            SELECT id, group_id, alt, image_url
                            FROM gallery_images
                            WHERE image_url IS NOT NULL
                              AND image_url NOT LIKE 'data:%'
                            ORDER BY group_id ASC, sort_order ASC, created_at ASC
                            """,
                            rowMapper());
        } catch (Exception e) {
            return List.of();
        }
    }

    private RowMapper<TrackerGalleryItem> rowMapper() {
        return (rs, rowNum) -> new TrackerGalleryItem(
                rs.getString("id"),
                rs.getString("group_id"),
                resolveImage(rs.getString("image_url")),
                rs.getString("alt"));
    }

    private String resolveImage(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return "";
        }
        if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://") || imageUrl.startsWith("data:")) {
            return imageUrl;
        }
        String base = trackerProperties.publicBaseUrl();
        if (base == null || base.isBlank()) {
            return imageUrl;
        }
        return base.replaceAll("/$", "") + (imageUrl.startsWith("/") ? imageUrl : "/" + imageUrl);
    }
}
