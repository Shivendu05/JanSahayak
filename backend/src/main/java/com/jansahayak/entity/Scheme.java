package com.jansahayak.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "schemes")
public class Scheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String targetGroup;

    @Column(columnDefinition = "TEXT")
    private String eligibility;

    @Column(columnDefinition = "TEXT")
    private String benefits;

    @Column(columnDefinition = "TEXT")
    private String requiredDocuments;

    @Column(columnDefinition = "TEXT")
    private String applicationProcess;

    private String deadline;

    @Column(nullable = false)
    private String officialWebsite;

    @Column(columnDefinition = "TEXT")
    private String videoUrl;

    @Column(columnDefinition = "TEXT")
    private String fullName;

    @Column(columnDefinition = "TEXT")
    private String department;

    @Column(columnDefinition = "TEXT")
    private String level;

    @Column(columnDefinition = "TEXT")
    private String purpose;

    @Column(columnDefinition = "TEXT")
    private String officialApplicationUrl;

    @Column(columnDefinition = "TEXT")
    private String eligibilityExclusions;

    @Column(columnDefinition = "TEXT")
    private String tags;

    @Column(columnDefinition = "TEXT")
    private String source;

    @Column(columnDefinition = "TEXT")
    private String lastVerified;

    @Column(columnDefinition = "TEXT")
    private String videoTitle;

    @JsonIgnore
    @OneToMany(mappedBy = "scheme", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Bookmark> bookmarks = new ArrayList<>();

    public Scheme() {
    }

    public Scheme(String name, String description, String category, String targetGroup, String eligibility,
            String benefits, String requiredDocuments, String applicationProcess, String deadline,
            String officialWebsite, String videoUrl) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.targetGroup = targetGroup;
        this.eligibility = eligibility;
        this.benefits = benefits;
        this.requiredDocuments = requiredDocuments;
        this.applicationProcess = applicationProcess;
        this.deadline = deadline;
        this.officialWebsite = officialWebsite;
        this.videoUrl = videoUrl;
    }

    public Scheme(String name, String description, String category, String targetGroup, String eligibility,
            String benefits, String requiredDocuments, String applicationProcess, String deadline,
            String officialWebsite, String videoUrl, String fullName, String department, String level,
            String purpose, String officialApplicationUrl, String eligibilityExclusions, String tags,
            String source, String lastVerified, String videoTitle) {
        this(name, description, category, targetGroup, eligibility, benefits, requiredDocuments,
                applicationProcess, deadline, officialWebsite, videoUrl);
        this.fullName = fullName;
        this.department = department;
        this.level = level;
        this.purpose = purpose;
        this.officialApplicationUrl = officialApplicationUrl;
        this.eligibilityExclusions = eligibilityExclusions;
        this.tags = tags;
        this.source = source;
        this.lastVerified = lastVerified;
        this.videoTitle = videoTitle;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTargetGroup() {
        return targetGroup;
    }

    public void setTargetGroup(String targetGroup) {
        this.targetGroup = targetGroup;
    }

    public String getEligibility() {
        return eligibility;
    }

    public void setEligibility(String eligibility) {
        this.eligibility = eligibility;
    }

    public String getBenefits() {
        return benefits;
    }

    public void setBenefits(String benefits) {
        this.benefits = benefits;
    }

    public String getRequiredDocuments() {
        return requiredDocuments;
    }

    public void setRequiredDocuments(String requiredDocuments) {
        this.requiredDocuments = requiredDocuments;
    }

    public String getApplicationProcess() {
        return applicationProcess;
    }

    public void setApplicationProcess(String applicationProcess) {
        this.applicationProcess = applicationProcess;
    }

    public String getDeadline() {
        return deadline;
    }

    public void setDeadline(String deadline) {
        this.deadline = deadline;
    }

    public String getOfficialWebsite() {
        return officialWebsite;
    }

    public void setOfficialWebsite(String officialWebsite) {
        this.officialWebsite = officialWebsite;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public String getOfficialApplicationUrl() {
        return officialApplicationUrl;
    }

    public void setOfficialApplicationUrl(String officialApplicationUrl) {
        this.officialApplicationUrl = officialApplicationUrl;
    }

    public String getEligibilityExclusions() {
        return eligibilityExclusions;
    }

    public void setEligibilityExclusions(String eligibilityExclusions) {
        this.eligibilityExclusions = eligibilityExclusions;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getLastVerified() {
        return lastVerified;
    }

    public void setLastVerified(String lastVerified) {
        this.lastVerified = lastVerified;
    }

    public String getVideoTitle() {
        return videoTitle;
    }

    public void setVideoTitle(String videoTitle) {
        this.videoTitle = videoTitle;
    }

    public List<Bookmark> getBookmarks() {
        return bookmarks;
    }

    public void setBookmarks(List<Bookmark> bookmarks) {
        this.bookmarks = bookmarks;
    }
}
