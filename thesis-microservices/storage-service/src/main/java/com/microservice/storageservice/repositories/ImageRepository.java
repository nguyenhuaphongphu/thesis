package com.microservice.storageservice.repositories;

import com.microservice.storageservice.entities.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Long> {
    Optional<Image> findByName(String name);

    boolean existsByName(String name);

    String deleteByName(String name);

    Optional<Image> findById(Long id);

    void deleteById(Long id);
}
