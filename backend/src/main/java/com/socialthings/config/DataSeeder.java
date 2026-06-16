package com.socialthings.config;

import com.socialthings.domain.Product;
import com.socialthings.repository.ProductRepository;
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
    CommandLineRunner seedProducts(ProductRepository productRepository) {
        return args -> {
            if (productRepository.count() > 0) {
                return;
            }

            log.info("Seeding catalog products");

            save(
                    productRepository,
                    "Relaxed Linen Shirt",
                    "relaxed-linen-shirt",
                    "98",
                    "Breathable linen with a relaxed drape for warm days and layered evenings.",
                    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80&auto=format&fit=crop",
                    List.of("Oat", "Charcoal"),
                    List.of("S", "M", "L", "XL"));

            save(
                    productRepository,
                    "Merino Crew Tee",
                    "merino-crew-tee",
                    "58",
                    "Fine-gauge merino that regulates temperature and resists odor naturally.",
                    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80&auto=format&fit=crop",
                    List.of("Black", "Stone", "Ivory"),
                    List.of("S", "M", "L", "XL"));

            save(
                    productRepository,
                    "Wool Overshirt",
                    "wool-overshirt",
                    "168",
                    "Structured overshirt in brushed wool — wears like a light jacket.",
                    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80&auto=format&fit=crop",
                    List.of("Navy", "Camel"),
                    List.of("S", "M", "L"));

            save(
                    productRepository,
                    "Canvas Tote",
                    "canvas-tote",
                    "42",
                    "Heavy canvas tote with interior pocket. Built for daily carry.",
                    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80&auto=format&fit=crop",
                    List.of("Natural"),
                    List.of("One size"));
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
