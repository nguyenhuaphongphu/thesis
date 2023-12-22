package com.microservice.emailservice.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "email_by_branch")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmailByBranch {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "email_customer")
    private String emailCustomer;

    @Column(name = "branch_id")
    private String branchId;

    @Column(name = "time")
    private Date time = new Date(System.currentTimeMillis());

}