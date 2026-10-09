package com.jansahayak.controller;

import com.jansahayak.repository.ResourceRepository;
import com.jansahayak.repository.SchemeRepository;
import com.jansahayak.repository.UserRepository;
import com.jansahayak.repository.VideoRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DashboardController {

    private final SchemeRepository schemeRepository;
    private final ResourceRepository resourceRepository;
    private final VideoRepository videoRepository;
    private final UserRepository userRepository;

    public DashboardController(SchemeRepository schemeRepository,
            ResourceRepository resourceRepository,
            VideoRepository videoRepository,
            UserRepository userRepository) {
        this.schemeRepository = schemeRepository;
        this.resourceRepository = resourceRepository;
        this.videoRepository = videoRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/dashboard")
    public Map<String, Long> getDashboardStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalSchemes", schemeRepository.count());
        stats.put("totalResources", resourceRepository.count());
        stats.put("totalVideos", videoRepository.count());
        stats.put("totalUsers", userRepository.count());
        return stats;
    }
}
