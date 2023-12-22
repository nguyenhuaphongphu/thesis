package com.microservice.emailservice.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmailRequest {
    private String sendTo;
    private String subject;
    private String branch;
    private String message;
    private String website;
    private String attachment;
}
