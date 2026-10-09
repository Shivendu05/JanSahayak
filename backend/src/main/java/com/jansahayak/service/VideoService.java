package com.jansahayak.service;

import com.jansahayak.entity.Video;
import com.jansahayak.exception.ResourceNotFoundException;
import com.jansahayak.repository.VideoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VideoService {

    private final VideoRepository videoRepository;

    public VideoService(VideoRepository videoRepository) {
        this.videoRepository = videoRepository;
    }

    public List<Video> getAllVideos() {
        return videoRepository.findAll();
    }

    public Video getVideoById(Long id) {
        return videoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Video not found with id: " + id));
    }

    public Video createVideo(Video video) {
        return videoRepository.save(video);
    }

    public Video updateVideo(Long id, Video updatedVideo) {
        Video existing = getVideoById(id);
        existing.setTitle(updatedVideo.getTitle());
        existing.setDescription(updatedVideo.getDescription());
        existing.setCategory(updatedVideo.getCategory());
        existing.setYoutubeUrl(updatedVideo.getYoutubeUrl());
        return videoRepository.save(existing);
    }

    public void deleteVideo(Long id) {
        Video video = getVideoById(id);
        videoRepository.delete(video);
    }
}
