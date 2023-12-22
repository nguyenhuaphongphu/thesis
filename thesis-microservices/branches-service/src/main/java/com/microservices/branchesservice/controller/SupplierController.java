package com.microservices.branchesservice.controller;

import com.microservices.branchesservice.model.Brand;
import com.microservices.branchesservice.model.Product;
import com.microservices.branchesservice.model.Supplier;
import com.microservices.branchesservice.repository.ProductRepository;
import com.microservices.branchesservice.repository.SupplierRepository;
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
@RequestMapping("/supplier")
public class SupplierController {
    @Autowired
    SupplierRepository supplierRepository;

    @Autowired
    ProductRepository productRepository;

    @GetMapping("")
    public ResponseEntity<List<Supplier>> list() {
        try {
            List<Supplier> suppliers = new ArrayList<>(supplierRepository.findAll());
            if (suppliers.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(suppliers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/page")
    public ResponseEntity<Map<String, Object>> listPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {
        try {
            List<Supplier> suppliers;
            Pageable paging = PageRequest.of(page, size);

            Page<Supplier> pageSuppliers;
            pageSuppliers = supplierRepository.findAll(paging);

            suppliers = pageSuppliers.getContent();

            Map<String, Object> response = new HashMap<>();
            response.put("items", suppliers);
            response.put("currentPage", pageSuppliers.getNumber());
            response.put("totalItems", pageSuppliers.getTotalElements());
            response.put("totalPages", pageSuppliers.getTotalPages());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Supplier> get(@PathVariable("id") String id) {
        try {
            Supplier supplier = supplierRepository.findById(id).orElse(null);
            return new ResponseEntity<>(supplier, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("")
    @PreAuthorize("hasRole('UPDATER') and hasRole('CREATE')")
    public ResponseEntity<Supplier> add(@RequestBody Supplier supplier) {
        try {
            supplierRepository.save(supplier);
            return new ResponseEntity<>(supplier,HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('UPDATER') and hasRole('UPDATE')")
    public ResponseEntity<Supplier> update(@PathVariable("id") String id, @RequestBody Supplier supplier) {
        try {
            supplier.setId(id);
            supplierRepository.save(supplier);
            return new ResponseEntity<>(supplier,HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{branchId}/{supplierId}")
    @PreAuthorize("hasRole('UPDATER') and hasRole('DELETE')")
    public ResponseEntity<?> delete(@PathVariable String branchId, @PathVariable String supplierId) {
        try {
            Supplier supplier = supplierRepository.findById(supplierId).orElse(null);
            List<Product> products = productRepository.findByBranchId(branchId);
            List<Product> productList = products.stream().filter(product -> product.getSupplier().equals(supplier.getName())).toList();
            if(productList.size() > 0){
                return ResponseEntity
                        .ok(new MessageResponse("Xóa sản phẩm có nhà cung cấp này trước!"));
            }else{
                supplierRepository.deleteById(supplierId);
                return ResponseEntity
                        .ok(new MessageResponse("Thành công!"));
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
