package com.microservices.ordersservice.repository;

import com.microservices.ordersservice.model.Bill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;


public interface BillRepository extends MongoRepository<Bill, String> {
    List<Bill> findByBranchId(String branchId);
    List<Bill> findByCustomerId(String customerId);

    Page<Bill> findAll(Pageable pageable);

    @Query("{$expr:{$and:[{$eq:[{$year:'$createdDate'}, ?0]}]}")
    List<Bill> findByCustomQuery(int year);

}
