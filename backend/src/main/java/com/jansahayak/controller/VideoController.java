package com.jansahayak.controller;

import com.jansahayak.entity.Video;
import com.jansahayak.service.VideoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class VideoController {

    private final VideoService videoService;

    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    @GetMapping("/videos")
    public List<Video> getAllVideos() {
        return videoService.getAllVideos();
    }

    @PostMapping("/videos")
    public ResponseEntity<Video> createVideo(@Valid @RequestBody Video video) {
        return ResponseEntity.ok(videoService.createVideo(video));
    }

    @PutMapping("/videos/{id}")
    public ResponseEntity<Video> updateVideo(@PathVariable Long id, @Valid @RequestBody Video video) {
        return ResponseEntity.ok(videoService.updateVideo(id, video));
    }

    @DeleteMapping("/videos/{id}")
    public ResponseEntity<Void> deleteVideo(@PathVariable Long id) {
        videoService.deleteVideo(id);
        return ResponseEntity.noContent().build();
    }
}
