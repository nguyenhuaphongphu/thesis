package com.microservice.authorservice.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class SignupRequest {
    private String username;

    @Email
    private String email;

    private String phone;
    private String address;
    private String fullName;
    private String managementAt;
    private Set<String> roles;

    @NotBlank
    private String password;
}