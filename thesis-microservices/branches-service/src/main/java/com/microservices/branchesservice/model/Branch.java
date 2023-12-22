package com.microservices.branchesservice.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "branches")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Branch {
    @Id
    private String id;
    private String name;
    private String phone;
    private String email;
    private String address;
    private String urlName;
    private Double latitude = 0.0;
    private Double longitude = 0.0;
}
