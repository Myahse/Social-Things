package com.socialthings.controller;

import com.socialthings.config.SeoProperties;
import com.socialthings.dto.product.ProductResponse;
import com.socialthings.service.ProductService;
import java.time.Duration;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * XML sitemap of the storefront: its public pages plus one entry per product in the tracker catalog,
 * so new products are listed without redeploying the site. The storefront serves it at /sitemap.xml
 * (a Vercel rewrite to /api/sitemap.xml); the CDN may cache it for an hour.
 */
@RestController
public class SitemapController {

    private static final Logger log = LoggerFactory.getLogger(SitemapController.class);

    /** Public storefront pages (account, cart and order pages are private and left out). */
    private static final List<String> PAGES = List.of(
            "/", "/product", "/gallery", "/about",
            "/legal/faq", "/legal/shipping", "/legal/returns", "/legal/privacy", "/legal/terms");

    private final ProductService productService;
    private final SeoProperties seo;

    public SitemapController(ProductService productService, SeoProperties seo) {
        this.productService = productService;
        this.seo = seo;
    }

    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> sitemap() {
        String base = seo.base();
        StringBuilder xml = new StringBuilder(2048)
                .append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n")
                .append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");
        for (String page : PAGES) {
            url(xml, base + page, null);
        }
        List<ProductResponse> products;
        try {
            products = productService.findAll();
        } catch (RuntimeException e) {
            // The catalog is unreachable: still serve the public pages.
            log.warn("Sitemap without products: {}", e.getMessage());
            products = List.of();
        }
        for (ProductResponse product : products) {
            String lastmod = product.createdAt() == null ? null : product.createdAt().substring(0, 10);
            url(xml, base + "/product/" + encodePath(product.slug()), lastmod);
        }
        xml.append("</urlset>\n");
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(Duration.ofHours(1)).cachePublic().sMaxAge(Duration.ofHours(1)))
                .contentType(MediaType.APPLICATION_XML)
                .body(xml.toString());
    }

    private static void url(StringBuilder xml, String loc, String lastmod) {
        xml.append("  <url><loc>").append(escape(loc)).append("</loc>");
        if (lastmod != null) {
            xml.append("<lastmod>").append(lastmod).append("</lastmod>");
        }
        xml.append("</url>\n");
    }

    private static String encodePath(String slug) {
        return java.net.URLEncoder.encode(slug, java.nio.charset.StandardCharsets.UTF_8).replace("+", "%20");
    }

    private static String escape(String s) {
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;").replace("'", "&apos;");
    }
}
