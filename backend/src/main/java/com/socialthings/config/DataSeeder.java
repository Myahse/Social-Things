package com.socialthings.config;

import com.socialthings.domain.Product;
import com.socialthings.repository.ProductRepository;
import com.socialthings.tracker.TrackerCatalogService;
import java.math.BigDecimal;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    @Bean
    CommandLineRunner seedProducts(
            ProductRepository productRepository, TrackerCatalogService trackerCatalogService) {
        return args -> {
            if (trackerCatalogService.enabled()) {
                log.info("Skipping demo product seed — catalog comes from tracker-social inventory");
                return;
            }
            if (productRepository.count() > 0) {
                return;
            }

            log.info("Seeding products");

            save(
                    productRepository,
                    "Green Piece",
                    "green",
                    "98",
                    "Bold green staple — cut for movement and everyday wear.",
                    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80&auto=format&fit=crop",
                    List.of("Green"),
                    List.of("S", "M", "L", "XL"));

            save(
                    productRepository,
                    "Orange Piece",
                    "orange",
                    "98",
                    "Statement orange layer — fearlessly expressive on the street.",
                    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80&auto=format&fit=crop",
                    List.of("Orange"),
                    List.of("S", "M", "L", "XL"));

            save(
                    productRepository,
                    "Red Piece",
                    "red",
                    "98",
                    "Deep red finish — structured fit with a relaxed drape.",
                    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80&auto=format&fit=crop",
                    List.of("Red"),
                    List.of("S", "M", "L", "XL"));
        };
    }

    private static void save(
            ProductRepository repository,
            String name,
            String slug,
            String price,
            String description,
            String image,
            List<String> colors,
            List<String> sizes) {

        Product product = new Product();
        product.setName(name);
        product.setSlug(slug);
        product.setPrice(new BigDecimal(price));
        product.setDescription(description);
        product.setImage(image);
        product.setColors(colors);
        product.setSizes(sizes);
        repository.save(product);
    }
}
