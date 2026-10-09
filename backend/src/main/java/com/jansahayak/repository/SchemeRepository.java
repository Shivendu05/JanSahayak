package com.jansahayak.repository;

import com.jansahayak.entity.Scheme;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SchemeRepository extends JpaRepository<Scheme, Long> {
    List<Scheme> findByCategoryIgnoreCase(String category);

    List<Scheme> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);
}
