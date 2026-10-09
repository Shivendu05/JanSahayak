package com.jansahayak;

import com.jansahayak.entity.Scheme;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class SchemeDataIntegrityTest {

    @Test
    void scheme_should_include_complete_government_metadata() {
        Scheme scheme = new Scheme();
        scheme.setName("PM-KISAN");
        scheme.setFullName("Pradhan Mantri Kisan Samman Nidhi");
        scheme.setDepartment("Department of Agriculture & Farmers Welfare");
        scheme.setLevel("Central Government");
        scheme.setPurpose("Income support for eligible landholding farmer families.");
        scheme.setOfficialApplicationUrl("https://pmkisan.gov.in/");
        scheme.setVideoTitle("PM-KISAN Government Information");
        scheme.setVideoUrl("https://www.youtube.com/watch?v=XsZQKa0wbiE");
        scheme.setSource("Official Government Website");
        scheme.setLastVerified("2026-10");

        assertEquals("Pradhan Mantri Kisan Samman Nidhi", scheme.getFullName());
        assertEquals("Department of Agriculture & Farmers Welfare", scheme.getDepartment());
        assertEquals("Central Government", scheme.getLevel());
        assertEquals("https://pmkisan.gov.in/", scheme.getOfficialApplicationUrl());
        assertEquals("PM-KISAN Government Information", scheme.getVideoTitle());
        assertEquals("Official Government Website", scheme.getSource());
        assertEquals("2026-10", scheme.getLastVerified());
    }
}
