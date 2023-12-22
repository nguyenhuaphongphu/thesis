package com.microservices.ordersservice.repository;

import com.microservices.ordersservice.model.ImportOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ImportOrderRepository extends MongoRepository<ImportOrder, String> {
    Page<ImportOrder> findByBranchId(Pageable pageable, String branchId);
}
