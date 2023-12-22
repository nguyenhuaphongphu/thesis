package com.microservice.emailservice.controller;

import com.microservice.emailservice.model.InfoCustomer;
import com.microservice.emailservice.repository.InfoCustomerRepository;
import com.microservice.emailservice.response.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/infoCustomer")
public class InfoCustomerController {
    @Autowired
    InfoCustomerRepository infoCustomerRepository;
    @GetMapping("")
    public ResponseEntity<List<InfoCustomer>> list() {
        try {
            List<InfoCustomer> infoCustomers = new ArrayList<>(infoCustomerRepository.findAll());
            if (infoCustomers.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(infoCustomers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("")
    public ResponseEntity<?> add(@RequestBody InfoCustomer infoCustomer) {
        if (infoCustomerRepository.existsByEmail(infoCustomer.getEmail())){
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Email đã tồn tại!"));
        }
        if (infoCustomerRepository.existsByPhone(infoCustomer.getPhone())){
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Số điện thoại đã tồn tại!"));
        }
        infoCustomerRepository.save((infoCustomer));
        return ResponseEntity.ok(new MessageResponse("Quan tâm thành công!"));
    }
}
