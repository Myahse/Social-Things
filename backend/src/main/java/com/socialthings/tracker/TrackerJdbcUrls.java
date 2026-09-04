package com.socialthings.tracker;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

final class TrackerJdbcUrls {

    record Connection(String url, String username, String password) {}

    private TrackerJdbcUrls() {}

    static Connection parse(String rawUrl, String username, String password) {
        String value = rawUrl == null ? "" : rawUrl.trim();
        if (value.isBlank()) {
            return null;
        }

        if (value.startsWith("postgres://") || value.startsWith("postgresql://")) {
            URI uri = URI.create(value);
            String user = blankToNull(username);
            String pass = blankToNull(password);
            String userInfo = uri.getRawUserInfo();
            if (userInfo != null && !userInfo.isBlank()) {
                int colon = userInfo.indexOf(':');
                if (colon >= 0) {
                    user = decode(userInfo.substring(0, colon));
                    pass = decode(userInfo.substring(colon + 1));
                } else {
                    user = decode(userInfo);
                }
            }
            String host = uri.getHost();
            if (host == null || host.isBlank()) {
                throw new IllegalArgumentException("Tracker database URL is missing a host");
            }
            String path = uri.getPath() == null || uri.getPath().isBlank() ? "/neondb" : uri.getPath();
            String query = sanitizeQuery(uri.getRawQuery());
            String jdbc = "jdbc:postgresql://"
                    + host
                    + (uri.getPort() > 0 ? ":" + uri.getPort() : "")
                    + path
                    + "?"
                    + query;
            return new Connection(jdbc, user, pass);
        }

        if (!value.startsWith("jdbc:")) {
            value = "jdbc:postgresql://" + value.replaceFirst("^/+", "");
        }
        return new Connection(value, blankToNull(username), blankToNull(password));
    }

    private static String sanitizeQuery(String rawQuery) {
        if (rawQuery == null || rawQuery.isBlank()) {
            return "sslmode=require";
        }
        String cleaned = rawQuery.replaceAll("(?i)&?channel_binding=[^&]*", "").replaceFirst("^&", "");
        return cleaned.isBlank() ? "sslmode=require" : cleaned;
    }

    private static String decode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }

    private static String blankToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value;
    }
}
