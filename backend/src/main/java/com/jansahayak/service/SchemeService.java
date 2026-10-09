package com.jansahayak.service;

import com.jansahayak.entity.Scheme;
import com.jansahayak.exception.ResourceNotFoundException;
import com.jansahayak.repository.SchemeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SchemeService {

    private final SchemeRepository schemeRepository;

    public SchemeService(SchemeRepository schemeRepository) {
        this.schemeRepository = schemeRepository;
    }

    public List<Scheme> getAllSchemes() {
        return schemeRepository.findAll();
    }

    public Scheme getSchemeById(Long id) {
        return schemeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found with id: " + id));
    }

    public Scheme createScheme(Scheme scheme) {
        return schemeRepository.save(scheme);
    }

    public Scheme updateScheme(Long id, Scheme updatedScheme) {
        Scheme existing = getSchemeById(id);
        existing.setName(updatedScheme.getName());
        existing.setDescription(updatedScheme.getDescription());
        existing.setCategory(updatedScheme.getCategory());
        existing.setTargetGroup(updatedScheme.getTargetGroup());
        existing.setEligibility(updatedScheme.getEligibility());
        existing.setBenefits(updatedScheme.getBenefits());
        existing.setRequiredDocuments(updatedScheme.getRequiredDocuments());
        existing.setApplicationProcess(updatedScheme.getApplicationProcess());
        existing.setDeadline(updatedScheme.getDeadline());
        existing.setOfficialWebsite(updatedScheme.getOfficialWebsite());
        existing.setVideoUrl(updatedScheme.getVideoUrl());
        existing.setFullName(updatedScheme.getFullName());
        existing.setDepartment(updatedScheme.getDepartment());
        existing.setLevel(updatedScheme.getLevel());
        existing.setPurpose(updatedScheme.getPurpose());
        existing.setOfficialApplicationUrl(updatedScheme.getOfficialApplicationUrl());
        existing.setEligibilityExclusions(updatedScheme.getEligibilityExclusions());
        existing.setTags(updatedScheme.getTags());
        existing.setSource(updatedScheme.getSource());
        existing.setLastVerified(updatedScheme.getLastVerified());
        existing.setVideoTitle(updatedScheme.getVideoTitle());
        return schemeRepository.save(existing);
    }

    public void deleteScheme(Long id) {
        Scheme scheme = getSchemeById(id);
        schemeRepository.delete(scheme);
    }

    public List<Scheme> searchSchemes(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getAllSchemes();
        }
        return schemeRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword);
    }

    public List<Scheme> getSchemesByCategory(String category) {
        return schemeRepository.findByCategoryIgnoreCase(category);
    }
}
