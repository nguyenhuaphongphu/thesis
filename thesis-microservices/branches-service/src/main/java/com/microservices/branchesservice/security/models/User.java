package com.microservices.branchesservice.security.models;

import java.util.HashSet;
import java.util.Set;

public class User {

  private String id;

  private String username;

  private String email;

  private String phone;
  private String fullName;
  private String address;
  private String password;
  private String managementAt;

  private Set<Role> roles = new HashSet<>();

  public User() {
  }

  public User(String username, String email, String phone, String fullName, String address, String password, String managementAt, Set<Role> roles) {
    this.username = username;
    this.email = email;
    this.phone = phone;
    this.fullName = fullName;
    this.address = address;
    this.password = password;
    this.managementAt = managementAt;
    this.roles = roles;
  }

  public User(String id, String username, String email, String phone, String fullName, String address, String password, String managementAt, Set<Role> roles) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.phone = phone;
    this.fullName = fullName;
    this.address = address;
    this.password = password;
    this.managementAt = managementAt;
    this.roles = roles;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public String getFullName() {
    return fullName;
  }

  public void setFullName(String fullName) {
    this.fullName = fullName;
  }

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getManagementAt() {
    return managementAt;
  }

  public void setManagementAt(String managementAt) {
    this.managementAt = managementAt;
  }

  public Set<Role> getRoles() {
    return roles;
  }

  public void setRoles(Set<Role> roles) {
    this.roles = roles;
  }
}