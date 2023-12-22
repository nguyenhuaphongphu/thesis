package com.microservices.branchesservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class BranchesServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(BranchesServiceApplication.class, args);
	}

}
