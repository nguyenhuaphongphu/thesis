package com.microservices.branchesservice.repository;

import com.microservices.branchesservice.model.Branch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BranchRepository extends MongoRepository<Branch, String> {

    Page<Branch> findAll(Pageable pageable);

    Branch findByUrlName(String urlName);
    boolean existsByName(String name);
    boolean existsByPhone(String phone);
    boolean existsByEmail(String email);
    boolean existsByAddress(String address);
    boolean existsByUrlName(String urlName);
}
