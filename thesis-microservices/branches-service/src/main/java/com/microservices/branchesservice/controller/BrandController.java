package com.microservices.branchesservice.controller;


import com.microservices.branchesservice.model.Brand;
import com.microservices.branchesservice.model.Product;
import com.microservices.branchesservice.repository.BranchRepository;
import com.microservices.branchesservice.repository.BrandRepository;
import com.microservices.branchesservice.repository.ProductRepository;
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
@RequestMapping("/brand")
public class BrandController {
    @Autowired
    BrandRepository brandRepository;

    @Autowired
    ProductRepository productRepository;


    @GetMapping("")
    public ResponseEntity<List<Brand>> list() {
        try {
            List<Brand> brands = new ArrayList<>(brandRepository.findAll());
            if (brands.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(brands, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/page")
    public ResponseEntity<Map<String, Object>> listPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {
        try {
            List<Brand> brands;
            Pageable paging = PageRequest.of(page, size);

            Page<Brand> pageBrands;
            pageBrands = brandRepository.findAll(paging);

            brands = pageBrands.getContent();

            Map<String, Object> response = new HashMap<>();
            response.put("items", brands);
            response.put("currentPage", pageBrands.getNumber());
            response.put("totalItems", pageBrands.getTotalElements());
            response.put("totalPages", pageBrands.getTotalPages());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Brand> get(@PathVariable("id") String id) {
        try {
            Brand brand = brandRepository.findById(id).orElse(null);
            return new ResponseEntity<>(brand, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("")
    @PreAuthorize("hasRole('UPDATER') and hasRole('CREATE')")
    public ResponseEntity<?> add(@RequestBody Brand brand) {
        if (brandRepository.existsByName(brand.getName())){
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Tên đã tồn tại!"));
        }
        brandRepository.save(brand);
        return ResponseEntity.ok(new MessageResponse("Tạo thương hiệu mới thành công!"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('UPDATER') and hasRole('UPDATE')")
    public ResponseEntity<Brand> update(@PathVariable("id") String id, @RequestBody Brand brand) {
        try {
            brand.setId(id);
            brandRepository.save(brand);
            return new ResponseEntity<>(brand,HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{branchId}/{brandId}")
    @PreAuthorize("hasRole('UPDATER') and hasRole('DELETE')")
    public ResponseEntity<?> delete(@PathVariable String branchId, @PathVariable String brandId) {
        try {
            Brand brand = brandRepository.findById(brandId).orElse(null);
            List<Product> products = productRepository.findByBranchId(branchId);
            List<Product> productList = products.stream().filter(product -> product.getBrand().equals(brand.getName())).toList();
            if(productList.size() > 0){
                return ResponseEntity
                        .ok(new MessageResponse("Xóa sản phẩm có thuương hiệu này trước!"));
            }else{
                brandRepository.deleteById(brandId);
                return ResponseEntity
                        .ok(new MessageResponse("Thành công!"));
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
