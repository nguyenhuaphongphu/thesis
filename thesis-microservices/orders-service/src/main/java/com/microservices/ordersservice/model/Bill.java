package com.microservices.ordersservice.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "bills")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Bill {
    @Id
    private String id;
    private Date time = new Date(System.currentTimeMillis());
    private boolean delivered = false;
    private boolean status = false;
    private boolean finish = false;
    private boolean paid = false;
    private String branchId;
    private Object branch;
    private List<Product> products;
    private String customerId;
    private Object customer;
    private int totalPrice;
    private String description;
    private boolean active = true;

}
