package com.microservices.branchesservice.repository;

import com.microservices.branchesservice.model.Brand;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BrandRepository extends MongoRepository<Brand,String> {

    Page<Brand> findAll(Pageable pageable);

    boolean existsByName(String name);
}
