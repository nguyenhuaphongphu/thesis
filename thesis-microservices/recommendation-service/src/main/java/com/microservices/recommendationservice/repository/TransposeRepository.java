package com.microservices.recommendationservice.repository;

import com.microservices.recommendationservice.model.Transpose;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransposeRepository extends JpaRepository<Transpose,Integer> {
    boolean existsByUserIdAndProductIdAndBranchId(String userId, String productId,String BranchId);

    List<Transpose> findByBranchId(String BranchId);

    List<Transpose> findByProductIdAndBranchId(String productId,String branchId);
    Transpose findByProductIdAndBranchIdAndUserId(String productId,String branchId,String userId);
}
