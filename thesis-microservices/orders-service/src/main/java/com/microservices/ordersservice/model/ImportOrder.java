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

@Document(collection = "importOrders")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ImportOrder {
    @Id
    private String id;
    private Date time = new Date(System.currentTimeMillis());
    private Object supplier;
    private int totalPrice;
    private String branchId;
    private Object[] products;
}
