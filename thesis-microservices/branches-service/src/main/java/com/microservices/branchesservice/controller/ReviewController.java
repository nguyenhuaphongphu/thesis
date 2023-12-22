package com.microservices.branchesservice.controller;

import com.microservices.branchesservice.model.Product;
import com.microservices.branchesservice.model.Review;
import com.microservices.branchesservice.repository.ReviewRepository;
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
@RequestMapping("/review")
public class ReviewController {
    @Autowired
    ReviewRepository reviewRepository;

//    @GetMapping("")
//    public ResponseEntity<List<Review>> list() {
//        try {
//            List<Review> comments = new ArrayList<>(reviewRepository.findAll());
//            if (comments.isEmpty()) {
//                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
//            }
//            return new ResponseEntity<>(comments, HttpStatus.OK);
//        } catch (Exception e) {
//            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }

    @GetMapping("")
    public ResponseEntity<Map<String, Object>> listPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {
        try {
            List<Review> comments;
            Pageable paging = PageRequest.of(page, size);

            Page<Review> pageComments;
            pageComments = reviewRepository.findAll(paging);

            comments = pageComments.getContent();

            Map<String, Object> response = new HashMap<>();
            response.put("items", comments);
            response.put("currentPage", pageComments.getNumber());
            response.put("totalItems", pageComments.getTotalElements());
            response.put("totalPages", pageComments.getTotalPages());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Review> get(@PathVariable("id") String id) {
        try {
            Review comment = reviewRepository.findById(id).orElse(null);
            return new ResponseEntity<>(comment, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("")
    public ResponseEntity<Review> add(@RequestBody Review review) {
        try {
            reviewRepository.save(review);
            return new ResponseEntity<>(review,HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Review> update(@PathVariable("id") String id, @RequestBody Review review) {
        try {
            review.setId(id);
            reviewRepository.save(review);
            return new ResponseEntity<>(review,HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') and hasRole('DELETE')")
    public ResponseEntity<HttpStatus> delete(@PathVariable("id") String id) {
        try {
            reviewRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> listProductsByBranch(@PathVariable String productId) {
        try {
            List<Review> reviews = new ArrayList<>(reviewRepository.findByProductId(productId));
            if (reviews.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(reviews, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
