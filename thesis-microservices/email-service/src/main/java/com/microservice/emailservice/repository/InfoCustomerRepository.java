package com.microservice.emailservice.repository;

import com.microservice.emailservice.model.InfoCustomer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InfoCustomerRepository extends JpaRepository<InfoCustomer,Integer> {
    boolean existsByPhone(String phone);
    boolean existsByEmail(String email);
}
