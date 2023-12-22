package com.microservices.branchesservice.controller;

import com.microservices.branchesservice.model.Product;
import com.microservices.branchesservice.model.Tag;
import com.microservices.branchesservice.model.TypeProduct;
import com.microservices.branchesservice.repository.ProductRepository;
import com.microservices.branchesservice.repository.TagRepository;
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
@RequestMapping("/tag")
public class TagController {
    @Autowired
    TagRepository tagRepository;

    @Autowired
    ProductRepository productRepository;

    @GetMapping("")
    public ResponseEntity<List<Tag>> list() {
        try {
            List<Tag> tags = new ArrayList<>(tagRepository.findAll());
            if (tags.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(tags, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/page")
    public ResponseEntity<Map<String, Object>> listPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {
        try {
            List<Tag> tags;
            Pageable paging = PageRequest.of(page, size);

            Page<Tag> pageTags;
            pageTags = tagRepository.findAll(paging);

            tags = pageTags.getContent();

            Map<String, Object> response = new HashMap<>();
            response.put("items", tags);
            response.put("currentPage", pageTags.getNumber());
            response.put("totalItems", pageTags.getTotalElements());
            response.put("totalPages", pageTags.getTotalPages());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tag> get(@PathVariable("id") String id) {
        try {
            Tag tag = tagRepository.findById(id).orElse(null);
            return new ResponseEntity<>(tag, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("")
    @PreAuthorize("hasRole('UPDATER') and hasRole('CREATE')")
    public ResponseEntity<?> add(@RequestBody Tag tag) {
        if (tagRepository.existsByName(tag.getName())){
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Tên đã tồn tại!"));
        }
        tagRepository.save(tag);
        return ResponseEntity.ok(new MessageResponse("Tạo thẻ mới thành công!"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('UPDATER') and hasRole('UPDATE')")
    public ResponseEntity<Tag> update(@PathVariable("id") String id, @RequestBody Tag tag) {
        try {
            tag.setId(id);
            tagRepository.save(tag);
            return new ResponseEntity<>(tag,HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{branchId}/{tagId}")
    @PreAuthorize("hasRole('UPDATER') and hasRole('DELETE')")
    public ResponseEntity<?> delete(@PathVariable String branchId,@PathVariable String tagId) {
        try {
            Tag tag = tagRepository.findById(tagId).orElse(null);
            List<Product> products = productRepository.findByBranchId(branchId);
            List<Product> productList = products.stream().filter(product ->
                    Arrays.stream(product.getTag()).anyMatch(tag1 -> tag1.equals(tag.getName()))).toList();
            if(productList.size() > 0){
                return ResponseEntity
                        .ok(new MessageResponse("Xóa sản phẩm có thẻ này trước!"));
            }else{
                tagRepository.deleteById(tagId);
                return ResponseEntity
                        .ok(new MessageResponse("Thành công!"));
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
