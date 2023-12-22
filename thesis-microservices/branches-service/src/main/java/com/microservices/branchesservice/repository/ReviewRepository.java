package com.microservices.branchesservice.repository;
import com.microservices.branchesservice.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReviewRepository extends MongoRepository<Review,String> {
    Page<Review> findAll(Pageable pageable);
    List<Review> findByProductId(String productId);
}
