package com.microservices.recommendationservice.proxy;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name="branches")
public interface ProductProxy {
    @GetMapping("/product/{id}")
    public Object detailProduct(
            @PathVariable String id
    );
}
