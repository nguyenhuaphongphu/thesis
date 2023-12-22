package com.microservices.ordersservice.proxy;

import com.microservices.ordersservice.model.Branch;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name="branches")
public interface BranchProxy {
    @GetMapping("/branch")
    public List<Branch> retrieveBranch();
}
