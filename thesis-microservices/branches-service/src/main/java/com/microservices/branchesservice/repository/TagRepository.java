package com.microservices.branchesservice.repository;

import com.microservices.branchesservice.model.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TagRepository extends MongoRepository<Tag,String> {
    Page<Tag> findAll(Pageable pageable);
    boolean existsByName(String name);
}
