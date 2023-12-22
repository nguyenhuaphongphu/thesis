package com.microservices.ordersservice.controller;

import com.microservices.ordersservice.model.Bill;
import com.microservices.ordersservice.model.ImportOrder;
import com.microservices.ordersservice.repository.ImportOrderRepository;
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
@RequestMapping("/importOrder")
public class ImportOrderController {
    @Autowired
    ImportOrderRepository importOrderRepository;

    @GetMapping("")
    public ResponseEntity<List<ImportOrder>> list() {
        try {
            List<ImportOrder> importOrders = new ArrayList<>(importOrderRepository.findAll());
            if (importOrders.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(importOrders, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> listPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        try {
            List<ImportOrder> importOrder;
            Pageable paging = PageRequest.of(page, size);

            Page<ImportOrder> pageImportOrders;
            pageImportOrders = importOrderRepository.findAll(paging);

            importOrder = pageImportOrders.getContent();

            Map<String, Object> response = new HashMap<>();
            response.put("items", importOrder);
            response.put("currentPage", pageImportOrders.getNumber());
            response.put("totalItems", pageImportOrders.getTotalElements());
            response.put("totalPages", pageImportOrders.getTotalPages());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImportOrder> get(@PathVariable String id) {
        try {
            ImportOrder importOrder = importOrderRepository.findById(id).orElse(null);
            return new ResponseEntity<>(importOrder, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("")
    @PreAuthorize("hasRole('UPDATER') and hasRole('CREATE')")
    public ResponseEntity<ImportOrder> add(@RequestBody ImportOrder importOrder) {
        try {
            importOrderRepository.save(importOrder);
            return new ResponseEntity<>(importOrder,HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ImportOrder> update(@PathVariable String id, @RequestBody ImportOrder importOrder) {
        try {
            importOrder.setId(id);
            importOrderRepository.save(importOrder);
            return new ResponseEntity<>(importOrder,HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('UPDATER') and hasRole('DELETE')")
    public ResponseEntity<HttpStatus> delete(@PathVariable String id) {
        try {
            importOrderRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/branch/{branchId}")
    public ResponseEntity<Map<String, Object>> listImportOrdersByBranch(@PathVariable String branchId, @RequestParam(defaultValue = "0") int page,
                                                                        @RequestParam(defaultValue = "8") int size){
        try {
            List<ImportOrder> importOrders;
            Pageable paging = PageRequest.of(page, size);

            Page<ImportOrder> importOrderPage;

            importOrderPage = importOrderRepository.findByBranchId(paging, branchId);

            importOrders = importOrderPage.getContent();

            Map<String, Object> response = new HashMap<>();
            response.put("items", importOrders);
            response.put("currentPage", importOrderPage.getNumber());
            response.put("totalItems", importOrderPage.getTotalElements());
            response.put("totalPages", importOrderPage.getTotalPages());

            if (importOrders.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
