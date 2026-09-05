package com.socialthings.mail;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Component
public class HtmlMailTemplates {

    public String welcome(String name, String shopUrl) {
        String greeting = name == null || name.isBlank() ? "" : "Hey " + escape(name) + " — ";
        return fill(
                "mail/welcome.html",
                Map.of(
                        "GREETING", greeting,
                        "SHOP_URL", shopUrl,
                        "LOGO_URL", logo(shopUrl)));
    }

    public String order(String name, String orderId, String itemsHtml, String total, String orderUrl, String shopUrl) {
        String greeting = name == null || name.isBlank() ? "" : "Hey " + escape(name) + ". ";
        return fill(
                "mail/order.html",
                Map.of(
                        "GREETING", greeting,
                        "ORDER_ID", escape(orderId),
                        "ITEMS", itemsHtml,
                        "TOTAL", escape(total),
                        "ORDER_URL", orderUrl,
                        "LOGO_URL", logo(shopUrl)));
    }

    public String newsletter(String shopUrl) {
        return fill("mail/newsletter.html", Map.of("SHOP_URL", shopUrl, "LOGO_URL", logo(shopUrl)));
    }

    public String orderItem(String product, String color, String size, int qty, String lineTotal) {
        return fill(
                "mail/order-item.html",
                Map.of(
                        "PRODUCT", escape(product),
                        "COLOR", escape(color),
                        "SIZE", escape(size),
                        "QTY", String.valueOf(qty),
                        "LINE_TOTAL", escape(lineTotal)));
    }

    private static String logo(String shopUrl) {
        return shopUrl.replaceAll("/$", "") + "/logo-mark.png";
    }

    private static String fill(String path, Map<String, String> values) {
        String html = read(path);
        for (Map.Entry<String, String> entry : values.entrySet()) {
            html = html.replace("{{" + entry.getKey() + "}}", entry.getValue() == null ? "" : entry.getValue());
        }
        return html;
    }

    private static String read(String path) {
        try (InputStream in = new ClassPathResource(path).getInputStream()) {
            return new String(in.readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new IllegalStateException("Missing mail template " + path, e);
        }
    }

    static String escape(String value) {
        if (value == null) {
            return "";
        }
        return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
