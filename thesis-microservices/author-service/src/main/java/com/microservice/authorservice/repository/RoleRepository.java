package com.microservice.authorservice.repository;

import com.microservice.authorservice.models.ERole;
import com.microservice.authorservice.models.Role;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RoleRepository extends MongoRepository<Role, String> {
  Optional<Role> findByName(ERole name);
}
