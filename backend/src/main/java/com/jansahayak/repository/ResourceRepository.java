package com.jansahayak.repository;

import com.jansahayak.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceRepository extends JpaRepository<Resource, Long> {
}
