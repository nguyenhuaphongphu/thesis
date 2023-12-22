package com.microservice.authorservice.models;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
  @Id
  private String id;

  private String username;

  @Email
  private String email;

  private String phone;
  private String fullName;
  private String address;
  private String password;
  private String managementAt;
  private String token;
  @Column(columnDefinition = "TIMESTAMP")
  private LocalDateTime tokenCreationDate;

  @DBRef
  private Set<Role> roles = new HashSet<>();

  public User(String username, String email, String phone, String fullName, String address, String password) {
    this.username = username;
    this.email = email;
    this.phone = phone;
    this.fullName = fullName;
    this.address = address;
    this.password = password;
  }
}