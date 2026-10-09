package com.jansahayak.controller;

import com.jansahayak.entity.Scheme;
import com.jansahayak.service.SchemeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SchemeController {

    private final SchemeService schemeService;

    public SchemeController(SchemeService schemeService) {
        this.schemeService = schemeService;
    }

    @GetMapping("/schemes")
    public List<Scheme> getAllSchemes() {
        return schemeService.getAllSchemes();
    }

    @GetMapping("/schemes/{id}")
    public Scheme getSchemeById(@PathVariable Long id) {
        return schemeService.getSchemeById(id);
    }

    @GetMapping("/schemes/search")
    public List<Scheme> searchSchemes(@RequestParam String keyword) {
        return schemeService.searchSchemes(keyword);
    }

    @GetMapping("/schemes/category/{category}")
    public List<Scheme> getSchemesByCategory(@PathVariable String category) {
        return schemeService.getSchemesByCategory(category);
    }

    @PostMapping("/schemes")
    public ResponseEntity<Scheme> createScheme(@Valid @RequestBody Scheme scheme) {
        return ResponseEntity.ok(schemeService.createScheme(scheme));
    }

    @PutMapping("/schemes/{id}")
    public ResponseEntity<Scheme> updateScheme(@PathVariable Long id, @Valid @RequestBody Scheme scheme) {
        return ResponseEntity.ok(schemeService.updateScheme(id, scheme));
    }

    @DeleteMapping("/schemes/{id}")
    public ResponseEntity<Void> deleteScheme(@PathVariable Long id) {
        schemeService.deleteScheme(id);
        return ResponseEntity.noContent().build();
    }
}
