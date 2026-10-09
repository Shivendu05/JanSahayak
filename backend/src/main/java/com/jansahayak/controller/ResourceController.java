package com.jansahayak.controller;

import com.jansahayak.entity.Resource;
import com.jansahayak.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping("/resources")
    public List<Resource> getAllResources() {
        return resourceService.getAllResources();
    }

    @PostMapping("/resources")
    public ResponseEntity<Resource> createResource(@Valid @RequestBody Resource resource) {
        return ResponseEntity.ok(resourceService.createResource(resource));
    }

    @PutMapping("/resources/{id}")
    public ResponseEntity<Resource> updateResource(@PathVariable Long id, @Valid @RequestBody Resource resource) {
        return ResponseEntity.ok(resourceService.updateResource(id, resource));
    }

    @DeleteMapping("/resources/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}
