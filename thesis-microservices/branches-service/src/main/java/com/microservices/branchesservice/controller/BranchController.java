package com.microservices.branchesservice.controller;

import com.microservices.branchesservice.model.Branch;
import com.microservices.branchesservice.repository.BranchRepository;
import com.microservices.branchesservice.response.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/branch")
public class BranchController {
    @Autowired
    BranchRepository branchRepository;

    @GetMapping("")
    public ResponseEntity<List<Branch>> list() {
        try {
            List<Branch> branches = new ArrayList<>(branchRepository.findAll());
            if (branches.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(branches, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

//    @GetMapping("")
//    public ResponseEntity<Map<String, Object>> listPage(
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "8") int size) {
//        try {
//            List<Branch> branches;
//            Pageable paging = PageRequest.of(page, size);
//
//            Page<Branch> pageSuppliers;
//            pageSuppliers = branchRepository.findAll(paging);
//
//            branches = pageSuppliers.getContent();
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("items", branches);
//            response.put("currentPage", pageSuppliers.getNumber());
//            response.put("totalItems", pageSuppliers.getTotalElements());
//            response.put("totalPages", pageSuppliers.getTotalPages());
//
//            return new ResponseEntity<>(response, HttpStatus.OK);
//        } catch (Exception e) {
//            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }

    @GetMapping("/{id}")
    public ResponseEntity<Branch> get(@PathVariable("id") String id) {
        try {
            Branch branch = branchRepository.findById(id).orElse(null);
            return new ResponseEntity<>(branch, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/findByUrlName/{urlName}")
    public ResponseEntity<Branch> getBranchByUrl(@PathVariable String urlName) {
        try {
            Branch branch = branchRepository.findByUrlName(urlName);
            return new ResponseEntity<>(branch, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("")
    @PreAuthorize("hasRole('ADMIN') and hasRole('CREATE')")
    public ResponseEntity<?> add(@RequestBody Branch branch) {
        if (branchRepository.existsByAddress(branch.getAddress())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Địa chỉ đã được đăng ký!"));
        }
        if (branchRepository.existsByPhone(branch.getPhone())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Số điện thoại đã tồn tại!"));
        }
        if (branchRepository.existsByEmail(branch.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Email đã tồn tại!"));
        }
        if (branchRepository.existsByName(branch.getName())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Tên đã được đăng ký!"));
        }
        if (branchRepository.existsByUrlName(branch.getUrlName())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Code name đã được đăng ký!"));
        }
            branchRepository.save(branch);
            return ResponseEntity.ok(new MessageResponse("Một chi nhánh đã được khởi tạo thành công!"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') and hasRole('UPDATE')")
    public ResponseEntity<Branch> update(@PathVariable("id") String id, @RequestBody Branch branch) {
        try {
            branch.setId(id);
            branchRepository.save(branch);
            return new ResponseEntity<>(branch,HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') and hasRole('DELETE')")
    public ResponseEntity<HttpStatus> delete(@PathVariable("id") String id) {
        try {
            branchRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
