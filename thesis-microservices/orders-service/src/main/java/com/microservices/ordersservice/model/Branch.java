package com.microservices.ordersservice.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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
    private Double latitude;
    private Double longitude;
}
