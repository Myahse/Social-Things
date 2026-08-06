package com.socialthings.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id")
    private UUID userId;

    private String email;

    @Column(nullable = false)
    private String status = "PENDING";

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(nullable = false, length = 3)
    private String currency = "USD";

    @Column(name = "checkout_url", length = 1000)
    private String checkoutUrl;

    @Column(name = "shipping_name")
    private String shippingName;

    @Column(name = "shipping_line1")
    private String shippingLine1;

    @Column(name = "shipping_city")
    private String shippingCity;

    @Column(name = "shipping_region")
    private String shippingRegion;

    @Column(name = "shipping_postal")
    private String shippingPostal;

    @Column(name = "shipping_country")
    private String shippingCountry;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getCheckoutUrl() {
        return checkoutUrl;
    }

    public void setCheckoutUrl(String checkoutUrl) {
        this.checkoutUrl = checkoutUrl;
    }

    public String getShippingName() {
        return shippingName;
    }

    public void setShippingName(String shippingName) {
        this.shippingName = shippingName;
    }

    public String getShippingLine1() {
        return shippingLine1;
    }

    public void setShippingLine1(String shippingLine1) {
        this.shippingLine1 = shippingLine1;
    }

    public String getShippingCity() {
        return shippingCity;
    }

    public void setShippingCity(String shippingCity) {
        this.shippingCity = shippingCity;
    }

    public String getShippingRegion() {
        return shippingRegion;
    }

    public void setShippingRegion(String shippingRegion) {
        this.shippingRegion = shippingRegion;
    }

    public String getShippingPostal() {
        return shippingPostal;
    }

    public void setShippingPostal(String shippingPostal) {
        this.shippingPostal = shippingPostal;
    }

    public String getShippingCountry() {
        return shippingCountry;
    }

    public void setShippingCountry(String shippingCountry) {
        this.shippingCountry = shippingCountry;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }
}
