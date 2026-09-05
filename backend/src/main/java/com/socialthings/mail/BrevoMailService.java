package com.socialthings.mail;

import com.socialthings.config.BrevoProperties;
import com.socialthings.config.StorefrontProperties;
import com.socialthings.domain.Order;
import com.socialthings.domain.OrderItem;
import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class BrevoMailService {

    private static final Logger log = LoggerFactory.getLogger(BrevoMailService.class);

    private final BrevoProperties properties;
    private final StorefrontProperties storefrontProperties;
    private final HtmlMailTemplates templates;
    private final RestClient restClient;

    public BrevoMailService(
            BrevoProperties properties, StorefrontProperties storefrontProperties, HtmlMailTemplates templates) {
        this.properties = properties;
        this.storefrontProperties = storefrontProperties;
        this.templates = templates;
        this.restClient = RestClient.builder().baseUrl("https://api.brevo.com/v3").build();
    }

    public void sendWelcome(String name, String email) {
        sendHtml(email, name, "SOCIAL THINGS — you're in", templates.welcome(name, shopUrl()), "welcome");
    }

    public void sendOrderConfirmation(Order order) {
        if (order.getEmail() == null || order.getEmail().isBlank()) {
            log.info("Order {} has no email — skip confirmation", order.getId());
            return;
        }
        sendHtml(
                order.getEmail(),
                order.getShippingName(),
                "SOCIAL THINGS — order " + shortId(order),
                templates.order(
                        order.getShippingName(),
                        shortId(order),
                        orderItemsHtml(order),
                        String.valueOf(order.getSubtotal()),
                        blankTo(order.getCheckoutUrl(), shopUrl()),
                        shopUrl()),
                "order");
    }

    public void subscribeNewsletter(String email) {
        addToNewsletterList(email);
        sendHtml(
                email,
                null,
                "SOCIAL THINGS — you're on the list",
                templates.newsletter(shopUrl()),
                "newsletter");
    }

    private void addToNewsletterList(String email) {
        if (!properties.configured()) {
            return;
        }
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("email", email);
        body.put("updateEnabled", true);
        if (properties.hasTemplate(properties.newsletterListId())) {
            body.put("listIds", List.of(properties.newsletterListId()));
        }
        try {
            restClient
                    .post()
                    .uri("/contacts")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("api-key", properties.apiKey())
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception e) {
            log.info("Brevo contact upsert for {}: {}", email, e.getMessage());
        }
    }

    private void sendHtml(String email, String name, String subject, String html, String kind) {
        if (!properties.configured()) {
            log.debug("Brevo is not configured — skip {} email", kind);
            return;
        }
        if (email == null || email.isBlank()) {
            return;
        }

        Map<String, Object> to = new LinkedHashMap<>();
        to.put("email", email);
        if (name != null && !name.isBlank()) {
            to.put("name", name);
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("to", List.of(to));
        body.put(
                "sender",
                Map.of(
                        "name",
                        properties.senderName() == null || properties.senderName().isBlank()
                                ? "SOCIAL THINGS"
                                : properties.senderName(),
                        "email",
                        properties.senderEmail()));
        body.put("subject", subject);
        body.put("htmlContent", html);

        try {
            restClient
                    .post()
                    .uri("/smtp/email")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("api-key", properties.apiKey())
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();
            log.info("Brevo {} email sent to {}", kind, email);
        } catch (Exception e) {
            log.warn("Brevo {} email failed for {}: {}", kind, email, e.getMessage());
        }
    }

    private String shopUrl() {
        String url = storefrontProperties.url();
        if (url == null || url.isBlank()) {
            return "http://localhost:5173";
        }
        return url.replaceAll("/$", "");
    }

    private String orderItemsHtml(Order order) {
        StringBuilder lines = new StringBuilder();
        for (OrderItem item : order.getItems()) {
            BigDecimal line = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            lines.append(templates.orderItem(
                    item.getProductName(),
                    item.getColor(),
                    item.getSize(),
                    item.getQuantity(),
                    String.valueOf(line)));
        }
        return lines.toString();
    }

    private static String shortId(Order order) {
        String id = order.getId() == null ? "" : order.getId().toString();
        return id.length() > 8 ? id.substring(0, 8) : id;
    }

    private static String blankTo(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}
