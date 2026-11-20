package com.socialthings.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Public storefront address used in the sitemap. It is the canonical, served host: the bare domain
 * redirects (308) to www, and search engines expect sitemap URLs on the final host.
 */
@ConfigurationProperties(prefix = "app.seo")
public record SeoProperties(String siteUrl) {

    public String base() {
        String url = siteUrl == null || siteUrl.isBlank() ? "https://www.socialthngs.com" : siteUrl;
        return url.replaceAll("/+$", "");
    }
}
