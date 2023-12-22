package com.microservice.authorservice.repository;

import com.microservice.authorservice.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
  Optional<User> findByUsername(String username);

  Boolean existsByUsername(String username);
  User findByEmail(String email);

  User findByToken(String token);

  Boolean existsByEmail(String email);

  @Override
  Page<User> findAll(Pageable pageable);

}
