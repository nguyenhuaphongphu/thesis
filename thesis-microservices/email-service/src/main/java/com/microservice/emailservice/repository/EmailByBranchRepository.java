package com.microservice.emailservice.repository;

import com.microservice.emailservice.model.EmailByBranch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmailByBranchRepository extends JpaRepository<EmailByBranch,Integer> {
    List<EmailByBranch> findByBranchId(String branchId);

    boolean existsByEmailCustomerAndBranchId(String emailCustomer, String branchId);
}
