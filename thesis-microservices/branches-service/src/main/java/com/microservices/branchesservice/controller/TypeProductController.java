package com.microservices.branchesservice.controller;

import com.microservices.branchesservice.model.Product;
import com.microservices.branchesservice.model.Supplier;
import com.microservices.branchesservice.model.TypeProduct;
import com.microservices.branchesservice.repository.ProductRepository;
import com.microservices.branchesservice.repository.TypeProductRepository;
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
@RequestMapping("/typeOfProduct")
public class TypeProductController {
    @Autowired
    TypeProductRepository typeProductRepository;

    @Autowired
    ProductRepository productRepository;

    @GetMapping("")
    public ResponseEntity<List<TypeProduct>> list() {
        try {
            List<TypeProduct> typeProducts = new ArrayList<>(typeProductRepository.findAll());
            if (typeProducts.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(typeProducts, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/page")
    public ResponseEntity<Map<String, Object>> listPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {
        try {
            List<TypeProduct> typeProducts;
            Pageable paging = PageRequest.of(page, size);

            Page<TypeProduct> pageTypeProducts;
            pageTypeProducts = typeProductRepository.findAll(paging);

            typeProducts = pageTypeProducts.getContent();

            Map<String, Object> response = new HashMap<>();
            response.put("items", typeProducts);
            response.put("currentPage", pageTypeProducts.getNumber());
            response.put("totalItems", pageTypeProducts.getTotalElements());
            response.put("totalPages", pageTypeProducts.getTotalPages());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<TypeProduct> get(@PathVariable("id") String id) {
        try {
            TypeProduct typeProduct = typeProductRepository.findById(id).orElse(null);
            return new ResponseEntity<>(typeProduct, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("")
    @PreAuthorize("hasRole('UPDATER') and hasRole('CREATE')")
    public ResponseEntity<?> add(@RequestBody TypeProduct typeProduct) {
        if (typeProductRepository.existsByName(typeProduct.getName())){
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Tên đã tồn tại!"));
        }
        typeProductRepository.save((typeProduct));
        return ResponseEntity.ok(new MessageResponse("Tạo loại sản phẩm mới thành công!"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('UPDATER') and hasRole('UPDATE')")
    public ResponseEntity<TypeProduct> update(@PathVariable("id") String id, @RequestBody TypeProduct typeProduct) {
        try {
            typeProduct.setId(id);
            typeProductRepository.save(typeProduct);
            return new ResponseEntity<>(typeProduct, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('UPDATER') and hasRole('DELETE')")
    public ResponseEntity<HttpStatus> delete(@PathVariable("id") String id) {
        try {
            typeProductRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{branchId}/{typeProductId}")
    @PreAuthorize("hasRole('UPDATER') and hasRole('DELETE')")
    public ResponseEntity<?> delete(@PathVariable String branchId, @PathVariable String typeProductId) {
        try {
            TypeProduct typeProduct = typeProductRepository.findById(typeProductId).orElse(null);
            List<Product> products = productRepository.findByBranchId(branchId);
            List<Product> productList = products.stream().filter(product -> product.getType().equals(typeProduct.getName())).toList();
            if(productList.size() > 0){
                return ResponseEntity
                        .ok(new MessageResponse("Xóa sản phẩm có loại này trước!"));
            }else{
                typeProductRepository.deleteById(typeProductId);
                return ResponseEntity
                        .ok(new MessageResponse("Thành công!"));
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
