package com.microservice.emailservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "infoCustomer")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InfoCustomer {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "last_name")
    private String lastName;
    @Column(name = "first_name")
    private String firstName;
    @Column(name = "email")
    private String email;
    @Column(name = "phone")
    private String phone;
    @Column(name = "branch")
    private String branch = "651a7df22cc70b06a7ee8679";
    @Column(name = "time")
    private Date time = new Date(System.currentTimeMillis());

}
