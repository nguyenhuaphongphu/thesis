package com.microservices.branchesservice.repository;

import com.microservices.branchesservice.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.QueryByExampleExecutor;

import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {
    Page<Product> findAll(Pageable pageable);

    List<Product> findByBranchId(String branchId);
//    @Query("{branchId: ?0, tag: ?1}")
//    Page<Product> findByBranchWithTag(Pageable pageable,String branchId,String tag);
//    @Query("{branchId: ?0, type: ?1}")
//    Page<Product> findByBranchWithType(Pageable pageable,String branchId,String type);
//    @Query("{branchId: ?0, brand: ?1}")
//    Page<Product> findByBranchWithBrand(Pageable pageable,String branchId,String brand);
//
//    @Query("{branchId: ?0, tag: ?1, type: ?2}")
//    Page<Product> findByBranchWithTagAndType(Pageable pageable,String branchId,String tag,String type);
//
//    @Query("{branchId: ?0, tag: ?1, brand: ?2}")
//    Page<Product> findByBranchWithTagAndBrand(Pageable pageable,String branchId,String tag,String brand);
//
//    @Query("{branchId: ?0, tag: ?1, brand: ?2}")
//    Page<Product> findByBranchWithTagAndBrand(Pageable pageable,String branchId,String tag,String brand);
}
