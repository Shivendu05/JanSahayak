package com.jansahayak.repository;

import com.jansahayak.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByUserId(Long userId);

    Optional<Bookmark> findByUserIdAndSchemeId(Long userId, Long schemeId);

    void deleteByUserIdAndSchemeId(Long userId, Long schemeId);
}
