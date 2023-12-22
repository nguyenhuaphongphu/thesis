package com.microservices.ordersservice.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LineChart {
    private int[] data;
    private String label;
    private String borderColor;
    private boolean fill = false;
}
