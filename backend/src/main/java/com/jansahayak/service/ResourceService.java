package com.jansahayak.service;

import com.jansahayak.entity.Resource;
import com.jansahayak.exception.ResourceNotFoundException;
import com.jansahayak.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Resource getResourceById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
    }

    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    public Resource updateResource(Long id, Resource updatedResource) {
        Resource existing = getResourceById(id);
        existing.setName(updatedResource.getName());
        existing.setDescription(updatedResource.getDescription());
        existing.setCategory(updatedResource.getCategory());
        existing.setOfficialUrl(updatedResource.getOfficialUrl());
        return resourceRepository.save(existing);
    }

    public void deleteResource(Long id) {
        Resource resource = getResourceById(id);
        resourceRepository.delete(resource);
    }
}
