package com.socialthings.controller;

import com.socialthings.dto.newsletter.NewsletterSubscribeRequest;
import com.socialthings.mail.BrevoMailService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/newsletter")
public class NewsletterController {

    private final BrevoMailService brevoMailService;

    public NewsletterController(BrevoMailService brevoMailService) {
        this.brevoMailService = brevoMailService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> subscribe(@Valid @RequestBody NewsletterSubscribeRequest request) {
        brevoMailService.subscribeNewsletter(request.email().trim().toLowerCase());
        return ResponseEntity.ok(Map.of("status", "ok"));
    }
}
