package com.microservices.ordersservice.controller;

import com.microservices.ordersservice.model.*;
import com.microservices.ordersservice.proxy.BranchProxy;
import com.microservices.ordersservice.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/bill")
public class BillController {
    @Autowired
    BillRepository billRepository;

    @Autowired
    BranchProxy branchProxy;

    @GetMapping("")
    public ResponseEntity<List<Bill>> list() {
        try {
            List<Bill> bills = new ArrayList<>(billRepository.findAll());
            if (bills.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(bills, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> listPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {
        try {
            List<Bill> bills;
            Pageable paging = PageRequest.of(page, size);

            Page<Bill> pageBills;
            pageBills = billRepository.findAll(paging);

            bills = pageBills.getContent();

            Map<String, Object> response = new HashMap<>();
            response.put("items", bills);
            response.put("currentPage", pageBills.getNumber());
            response.put("totalItems", pageBills.getTotalElements());
            response.put("totalPages", pageBills.getTotalPages());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bill> get(@PathVariable String id) {
        try {
            Bill bill = billRepository.findById(id).orElse(null);
            return new ResponseEntity<>(bill, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("")
    public ResponseEntity<Bill> add(@RequestBody Bill bill) {
        try {
            billRepository.save(bill);
            return new ResponseEntity<>(bill, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SELLER') and hasRole('UPDATE')")
    public ResponseEntity<Bill> update(@PathVariable("id") String id, @RequestBody Bill bill) {
        try {
            bill.setId(id);
            billRepository.save(bill);
            return new ResponseEntity<>(bill, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> delete(@PathVariable String id) {
        try {
            billRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<Bill>> listBillsByBranch(@PathVariable String branchId) {
        try {
            List<Bill> bills = new ArrayList<>(billRepository.findByBranchId(branchId));
            if (bills.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(bills, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Bill>> listBillsByCustomer(@PathVariable String customerId) {
        try {
            List<Bill> bills = new ArrayList<>(billRepository.findByCustomerId(customerId));
            if (bills.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(bills, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/lineChart/{year}")
    public ResponseEntity<?> lineChart(@PathVariable int year) {
        Random random = new Random();
        Set<LineChart> lineCharts = new HashSet<>();
        try {
            List<Branch> branches = new ArrayList<>(branchProxy.retrieveBranch());
            for (Branch branch : branches) {
                List<Bill> bills = new ArrayList<>(billRepository.findByBranchId(branch.getId()));
                List<Bill> result = bills.stream().filter(bill -> bill.getTime().getYear() + 1900 == year).collect(Collectors.toList());
                int[] arrPrice = new int[12];
                for (int i = 0; i <= 11; i++) {
                    int abc = i + 1;
                    List<Bill> resultByMonth = result.stream().filter(bill -> bill.getTime().getMonth() + 1 == abc).collect(Collectors.toList());
                    arrPrice[i] = resultByMonth.stream()
                            .reduce(0, (s,ob)->s+ob.getTotalPrice(),Integer::sum);
                }
                LineChart lineChart = new LineChart(arrPrice, branch.getName(),String.format("#%06x", random.nextInt(256*256*256)),false);
                lineCharts.add(lineChart);
            }
            return new ResponseEntity<>(lineCharts, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/checkExist/{productId}/{branchId}")
    public ResponseEntity<?> checkExist(@PathVariable String productId, @PathVariable String branchId) {
        try {
           List<Bill> bills = billRepository.findByBranchId(branchId);
           List<Bill> notFinish = bills.stream().filter(bill -> bill.isFinish() == Boolean.FALSE).collect(Collectors.toList());
            List<Bill> result = notFinish.stream().filter(bill ->
                    bill.getProducts().stream().anyMatch(product -> productId.equals(product.getId()))).toList();
           return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/checkExistBranch/{branchId}")
    public ResponseEntity<?> checkExistBranch(@PathVariable String branchId) {
        try {
            List<Bill> bills = billRepository.findByBranchId(branchId);
            List<Bill> notFinish = bills.stream().filter(bill -> bill.isFinish() == Boolean.FALSE).collect(Collectors.toList());
            return new ResponseEntity<>(notFinish, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/bought/{branchId}/{productId}/{userId}")
    public ResponseEntity<?> checkBought(@PathVariable String branchId,@PathVariable String productId,@PathVariable String userId) {
        try {
            List<Bill> bills = billRepository.findByBranchId(branchId);
            List<Bill> billsOfUser = bills.stream().filter(bill -> userId.equals(bill.getCustomerId())).collect(Collectors.toList());
            List<Bill> result = billsOfUser.stream().filter(bill ->
                    bill.getProducts().stream().anyMatch(product -> productId.equals(product.getId()))).collect(Collectors.toList());
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
