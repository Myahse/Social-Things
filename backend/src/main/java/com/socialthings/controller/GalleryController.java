package com.socialthings.controller;

import com.socialthings.dto.gallery.GalleryImageResponse;
import com.socialthings.tracker.TrackerGalleryRepository;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/gallery")
public class GalleryController {

    private final TrackerGalleryRepository galleryRepository;

    public GalleryController(TrackerGalleryRepository galleryRepository) {
        this.galleryRepository = galleryRepository;
    }

    @GetMapping
    public List<GalleryImageResponse> list() {
        return galleryRepository.findAll().stream()
                .filter(item -> item.src() != null && !item.src().isBlank())
                .map(item -> new GalleryImageResponse(item.id(), item.group(), item.src(), item.alt()))
                .toList();
    }
}
