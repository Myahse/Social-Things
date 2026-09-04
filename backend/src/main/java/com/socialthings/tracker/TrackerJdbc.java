package com.socialthings.tracker;

import com.socialthings.config.TrackerProperties;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class TrackerJdbc {

    private static final Logger log = LoggerFactory.getLogger(TrackerJdbc.class);

    private final JdbcTemplate jdbc;

    public TrackerJdbc(TrackerProperties properties) {
        this.jdbc = create(properties);
    }

    public boolean available() {
        return jdbc != null;
    }

    public JdbcTemplate require() {
        if (jdbc == null) {
            throw new IllegalStateException("Tracker inventory database is not configured");
        }
        return jdbc;
    }

    private static JdbcTemplate create(TrackerProperties properties) {
        if (!properties.configured()) {
            return null;
        }

        try {
            TrackerJdbcUrls.Connection connection =
                    TrackerJdbcUrls.parse(properties.url(), properties.username(), properties.password());
            if (connection == null) {
                return null;
            }

            HikariConfig config = new HikariConfig();
            config.setPoolName("tracker-inventory");
            config.setDriverClassName("org.postgresql.Driver");
            config.setJdbcUrl(connection.url());
            if (connection.username() != null) {
                config.setUsername(connection.username());
            }
            if (connection.password() != null) {
                config.setPassword(connection.password());
            }
            config.setMaximumPoolSize(3);
            config.setMinimumIdle(0);
            config.setConnectionTimeout(4_000);
            config.setIdleTimeout(20_000);
            config.setMaxLifetime(180_000);
            config.setInitializationFailTimeout(-1);
            return new JdbcTemplate(new HikariDataSource(config));
        } catch (Exception e) {
            log.error("Tracker inventory connection failed — shop catalog will stay empty: {}", e.getMessage());
            return null;
        }
    }
}
