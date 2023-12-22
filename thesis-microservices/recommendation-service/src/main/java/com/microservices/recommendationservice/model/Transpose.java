package com.microservices.recommendationservice.model;

import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "transpose")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transpose {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "userId")
    private String userId;

    @Column(name = "branchId")
    private String branchId;

    @Column(name = "productId")
    private String productId;

    @Column(name = "rating")
    private double rating;
}