package com.microservices.branchesservice.repository;

import com.microservices.branchesservice.model.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SupplierRepository extends MongoRepository<Supplier,String> {
    Page<Supplier> findAll(Pageable pageable);
}
