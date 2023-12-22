package com.microservice.emailservice.controller;

import com.microservice.emailservice.model.EmailByBranch;
import com.microservice.emailservice.repository.EmailByBranchRepository;
import com.microservice.emailservice.response.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/emailByBranch")
public class EmailByBranchController {
    @Autowired
    EmailByBranchRepository emailByBranchRepository;
    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<EmailByBranch>> listEmailByBranch(@PathVariable String branchId) {
        try {
            List<EmailByBranch> emailByBranches = new ArrayList<>(emailByBranchRepository.findByBranchId(branchId));
            if (emailByBranches.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(emailByBranches, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("")
    public ResponseEntity<?> add(@RequestBody EmailByBranch emailByBranch) {
        if (emailByBranchRepository.existsByEmailCustomerAndBranchId(emailByBranch.getEmailCustomer(), emailByBranch.getBranchId())){
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Email đã tồn tại!"));
        }
        emailByBranchRepository.save((emailByBranch));
        return ResponseEntity.ok(new MessageResponse("Thành công!"));
    }
}
