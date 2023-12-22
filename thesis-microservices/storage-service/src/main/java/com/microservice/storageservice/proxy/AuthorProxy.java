package com.microservice.storageservice.proxy;

import com.microservice.storageservice.security.models.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name="author")
public interface AuthorProxy {
    @GetMapping("/auth/{username}")
    public User retrieveUser(@PathVariable String username);
}
