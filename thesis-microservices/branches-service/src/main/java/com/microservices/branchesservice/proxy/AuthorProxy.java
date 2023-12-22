package com.microservices.branchesservice.proxy;

import com.microservices.branchesservice.security.models.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name="author")
public interface AuthorProxy {
    @GetMapping("/auth/returnSecure")
    public User returnSecurity();

    @GetMapping("/auth/{username}")
    public User retrieveUser(
            @PathVariable String username
    );
}
