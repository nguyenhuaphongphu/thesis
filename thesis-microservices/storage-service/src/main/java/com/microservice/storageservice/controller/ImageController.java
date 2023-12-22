package com.microservice.storageservice.controller;

import com.microservice.storageservice.entities.Image;
import com.microservice.storageservice.proxy.AuthorProxy;
import com.microservice.storageservice.repositories.ImageRepository;
import com.microservice.storageservice.security.models.User;
import com.microservice.storageservice.util.ImageUtility;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/images")
public class ImageController {

    @Autowired
    ImageRepository imageRepository;

    @PostMapping("/upload")
    public ResponseEntity<ImageUploadResponse> uploadImage(@RequestParam("images") MultipartFile[] files) throws IOException {
        boolean checkSameFileName = true;
        for (MultipartFile file : files) {
            if (imageRepository.existsByName(file.getOriginalFilename())) {
                checkSameFileName = false;
                return ResponseEntity.status(HttpStatus.FOUND).body(new ImageUploadResponse("Ảnh " + file.getOriginalFilename() + " đã tồn tại!"));
            }
        }
        if (checkSameFileName = true) {
            for (MultipartFile file : files) {
                imageRepository.save(Image.builder()
                        .name(file.getOriginalFilename())
                        .type(file.getContentType())
                        .image(ImageUtility.compressImage(file.getBytes()))
                        .build());

            }
        }
        return ResponseEntity.status(HttpStatus.OK).body(new ImageUploadResponse("Image uploaded successfully!"));
    }

    @GetMapping("/info/{name}")
    public Image getImageDetails(@PathVariable("name") String name) throws IOException {
        final Optional<Image> dbImage = imageRepository.findByName(name);
        return Image.builder().name(dbImage.get().getName()).type(dbImage.get().getType()).image(ImageUtility.decompressImage(dbImage.get().getImage())).build();
    }


    @GetMapping("/{name}")
    public ResponseEntity<byte[]> getImage(@PathVariable("name") String name) throws IOException {
        final Optional<Image> dbImage = imageRepository.findByName(name);
        return ResponseEntity.ok().contentType(MediaType.valueOf(dbImage.get().getType())).body(ImageUtility.decompressImage(dbImage.get().getImage()));
    }

    @Transactional
    @DeleteMapping("/{name}")
    public ResponseEntity<?> deleteImage(@PathVariable("name") String name) throws IOException {
        imageRepository.deleteByName(name);
        return ResponseEntity.status(HttpStatus.OK).body(new ImageUploadResponse("Deleted " + name + " successful!"));
    }

}