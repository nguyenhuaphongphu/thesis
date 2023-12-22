package com.microservices.recommendationservice.controller;

import com.microservices.recommendationservice.model.Transpose;
import com.microservices.recommendationservice.proxy.ProductProxy;
import com.microservices.recommendationservice.repository.TransposeRepository;
import com.microservices.recommendationservice.response.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

import static java.lang.Math.*;

@RestController
@RequestMapping("/transpose")
public class TransposeController {
    @Autowired
    TransposeRepository transposeRepository;

    @Autowired
    ProductProxy productProxy;

    @PostMapping("")
    public ResponseEntity<?> add(@RequestBody Transpose transpose) {

        boolean transpose1 = transposeRepository.existsByUserIdAndProductIdAndBranchId(transpose.getUserId(), transpose.getProductId(), transpose.getBranchId());
        if(transpose1 == Boolean.TRUE) {
            Transpose transpose2 = transposeRepository.findByProductIdAndBranchIdAndUserId(transpose.getProductId(),transpose.getBranchId(),transpose.getUserId());
            double rating = transpose2.getRating()+transpose.getRating();
            transpose2.setRating(rating/2);
            transposeRepository.save(transpose2);
        }else{
            transposeRepository.save(transpose);
        }
        return ResponseEntity.ok(new MessageResponse("Thành công"));
    }

    @GetMapping("/averageRating/{branchId}")
    public ResponseEntity<?> listRecommendation(@PathVariable String branchId) {
        try {
            List<Transpose> transposeList = new ArrayList<>(transposeRepository.findByBranchId(branchId));
            HashMap<String, Double> averageValue = new HashMap<String, Double>();
            for (Transpose transpose : transposeList) {
                double rating = averageValue.containsKey(transpose.getProductId()) ? averageValue.get(transpose.getProductId()) : 0;
                rating += transpose.getRating();
                averageValue.put(transpose.getProductId(), rating);
            }
            for (Map.Entry<String, Double> set : averageValue.entrySet()) {
                List<Transpose> lengthProduct = new ArrayList<>(transposeRepository.findByProductIdAndBranchId(set.getKey(), branchId));
                set.setValue(set.getValue() / lengthProduct.size());
            }
            for (Transpose transpose : transposeList) {
                transpose.setRating((double) Math.round((transpose.getRating() - averageValue.get(transpose.getProductId())) * 10) / 10);
            }
            HashMap<String, Double> averageValue1 = new HashMap<String, Double>();
            for (Transpose transpose : transposeList) {
                double rating = averageValue1.containsKey(transpose.getProductId()) ? averageValue1.get(transpose.getProductId()) : 0.0;
                rating += transpose.getRating();
                averageValue1.put(transpose.getProductId(), (double) Math.round(rating * 10) / 10);
            }
            Map<String, Double> finalResult = averageValue1.entrySet().stream().filter(a -> a.getValue() > 0.0).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
            List<Object> listProduct = new ArrayList<Object>();
            for (Map.Entry<String, Double> product : finalResult.entrySet()) {
                listProduct.add(productProxy.detailProduct(product.getKey()));
            }
            return new ResponseEntity<>(listProduct, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{branchId}/{userId}")
    public ResponseEntity<?> recommendationByItem(@PathVariable String branchId, @PathVariable String userId) {
        try {
            List<Transpose> transposeList = new ArrayList<>(transposeRepository.findByBranchId(branchId));
            HashMap<String, Double> averageValue = new HashMap<String, Double>();
            //tinh tong cua cac item
            for (Transpose transpose : transposeList) {
                double rating = averageValue.containsKey(transpose.getProductId()) ? averageValue.get(transpose.getProductId()) : 0;
                rating += transpose.getRating();
                averageValue.put(transpose.getProductId(), rating);
            }
            //tinh trung binh tong cac item
            for (Map.Entry<String, Double> set : averageValue.entrySet()) {
                List<Transpose> lengthProduct = new ArrayList<>(transposeRepository.findByProductIdAndBranchId(set.getKey(), branchId));
                set.setValue(set.getValue() / lengthProduct.size());
            }
            //tru rating cho trung binh tong
            for (Transpose transpose : transposeList) {
                transpose.setRating(transpose.getRating() - averageValue.get(transpose.getProductId()));
            }
            //lay anh sach san pham rating cua nguoi dung duoc truyen vao neu khong rating thi bang 0
            HashMap<String, Double> ratingUser = new HashMap<String, Double>();
            for (Transpose transpose : transposeList) {
                if (userId.equals(transpose.getUserId())) {
                    double rating = ratingUser.containsKey(transpose.getProductId()) ? ratingUser.get(transpose.getProductId()) : 0.0;
                    rating = (rating + transpose.getRating()) / 2;
                    ratingUser.put(transpose.getProductId(), rating);
                }
                if (!userId.equals(transpose.getUserId())) {
                    double rating = ratingUser.containsKey(transpose.getProductId()) ? ratingUser.get(transpose.getProductId()) : 0.0;
                    ratingUser.put(transpose.getProductId(), rating);
                }
            }
            //lay san pham can duong tinh toan de goi y
            Map<String, Double> listRecommendProduct = ratingUser.entrySet().stream().filter(a -> a.getValue() == 0.0).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
            //nhung san pham dung de tinh toan de goi y
            Map<String, Double> listProductUseToRecommendation = ratingUser.entrySet().stream().filter(a -> a.getValue() != 0.0).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
            //tinh gia tri cua nhung san pham chua dx user truyen vao danh gia
            for (Map.Entry<String, Double> set : listRecommendProduct.entrySet()) {
                List<Transpose> a1 = null;
                List<Transpose> b1 = null;
                List<Transpose> recommendProduct = new ArrayList<>(transposeRepository.findByProductIdAndBranchId(set.getKey(), branchId));
                for (Map.Entry<String, Double> set1 : listProductUseToRecommendation.entrySet()) {
                    List<Transpose> productUserToRecommendation = new ArrayList<>(transposeRepository.findByProductIdAndBranchId(set1.getKey(), branchId));
                    //nhung san pham co cung user danh gia
                    List<Transpose> a = recommendProduct.stream().filter(transpose -> productUserToRecommendation.stream().anyMatch(transpose1 -> transpose.getUserId().equals(transpose1.getUserId()))).collect(Collectors.toList());
                    List<Transpose> b = productUserToRecommendation.stream().filter(transpose -> recommendProduct.stream().anyMatch(transpose1 -> transpose.getUserId().equals(transpose1.getUserId()))).collect(Collectors.toList());
                    a1 = a;
                    b1 = b;
                    //tinh gia tri gan nhat
                    double dotProduct = 0.0, firstNorm = 0.0, secondNorm = 0.0;
                    double cosinSimilarity;
                    for (int i = 0; i < a.size(); i++) {
                        dotProduct += (a.get(i).getRating() * b.get(i).getRating());
                        firstNorm += pow(a.get(i).getRating(), 2);
                        secondNorm += pow(b.get(i).getRating(), 2);
                    }
                    cosinSimilarity = (dotProduct / (sqrt(abs(firstNorm)) * sqrt(abs(secondNorm))));
                    listProductUseToRecommendation.put(set1.getKey(), cosinSimilarity);
                }
                // tim hai item giong voi item can tim nhat
                if(listProductUseToRecommendation.size()>2){
                    Map.Entry<String, Double> max = listProductUseToRecommendation.entrySet()
                            .stream()
                            .max((o1, o2) -> o1.getValue().compareTo(o2.getValue())) // find the max
                            .get();
                    Transpose a2 = transposeRepository.findByProductIdAndBranchIdAndUserId(max.getKey(), branchId, userId);
                    Map.Entry<String, Double> max2 = listProductUseToRecommendation.entrySet()
                            .stream()
                            .filter((e) -> !e.getKey().equals(max.getKey())) // remove the first max
                            .max((o1, o2) -> o1.getValue().compareTo(o2.getValue()))
                            .get();
                    Transpose b2 = transposeRepository.findByProductIdAndBranchIdAndUserId(max2.getKey(), branchId, userId);
                    double result = (max.getValue() * (a2.getRating() + averageValue.get(a2.getProductId())) + max2.getValue() * (b2.getRating() + averageValue.get(b2.getProductId()))) / (max.getValue() + max2.getValue());
                    listRecommendProduct.put(set.getKey(), result);
                }else{
                    listRecommendProduct.put(set.getKey(), 0.0);
                }
            }
            //tra ve cac san pham dx goi y
            Map<String, Double> finalResult = listRecommendProduct.entrySet().stream().filter(a -> a.getValue() > 2.5 ).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
            List<Object> listProduct = new ArrayList<Object>();
            for (Map.Entry<String, Double> product : finalResult.entrySet()) {
                listProduct.add(productProxy.detailProduct(product.getKey()));
            }
            return new ResponseEntity<>(listProduct, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
