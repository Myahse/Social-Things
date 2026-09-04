package com.socialthings.tracker;

import com.socialthings.config.TrackerProperties;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class TrackerJdbc {

    private final JdbcTemplate jdbc;

    public TrackerJdbc(TrackerProperties properties) {
        if (!properties.configured()) {
            this.jdbc = null;
            return;
        }

        HikariConfig config = new HikariConfig();
        config.setPoolName("tracker-inventory");
        config.setDriverClassName("org.postgresql.Driver");
        config.setJdbcUrl(properties.url());
        config.setUsername(properties.username());
        config.setPassword(properties.password());
        config.setMaximumPoolSize(3);
        config.setMinimumIdle(0);
        config.setConnectionTimeout(4_000);
        config.setIdleTimeout(20_000);
        config.setMaxLifetime(180_000);
        config.setInitializationFailTimeout(-1);
        this.jdbc = new JdbcTemplate(new HikariDataSource(config));
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
}
