package com.microservice.authorservice.controller;

import com.microservice.authorservice.models.ERole;
import com.microservice.authorservice.models.Role;
import com.microservice.authorservice.models.User;
import com.microservice.authorservice.payload.request.LoginRequest;
import com.microservice.authorservice.payload.request.SignupRequest;
import com.microservice.authorservice.payload.response.JwtResponse;
import com.microservice.authorservice.payload.response.MessageResponse;
import com.microservice.authorservice.repository.RoleRepository;
import com.microservice.authorservice.repository.UserRepository;
import com.microservice.authorservice.security.jwt.JwtUtils;
import com.microservice.authorservice.security.services.UserDetailsImpl;
import com.microservice.authorservice.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @GetMapping("")
    @PreAuthorize("hasRole('ADMIN') and hasRole('READ')")
    public ResponseEntity<List<User>> list() {
        try {
            List<User> users = new ArrayList<>(userRepository.findAll());
            if (users.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                roles,
                userDetails.getManagementAt()));
    }


    @GetMapping("/{userName}")
    public ResponseEntity<User> findUserByUsername(@PathVariable String userName) {
        try {
            User user = userRepository.findByUsername(userName).orElse(null);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<User> findUserById(@PathVariable String id) {
        try {
            User user = userRepository.findById(id).orElse(null);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PatchMapping("/{id}")
    @PreAuthorize("(hasRole('ADMIN') and hasRole('UPDATE'))")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody SignupRequest user) {
        User newUser = userRepository.findById(id).get();
        Set<String> strRoles = user.getRoles();
        Set<Role> roles = new HashSet<>();
        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "updater":
                        Role updateRole = roleRepository.findByName(ERole.ROLE_UPDATER)
                                .orElseThrow(() -> new RuntimeException("Error: Updater is not found."));
                        roles.add(updateRole);
                        break;
                    case "seller":
                        Role sellRole = roleRepository.findByName(ERole.ROLE_SELLER)
                                .orElseThrow(() -> new RuntimeException("Error: Seller is not found."));
                        roles.add(sellRole);
                        break;
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Admin is not found."));
                        roles.add(adminRole);
                        break;
                    case "manager":
                        Role managerRole = roleRepository.findByName(ERole.ROLE_MANAGER)
                                .orElseThrow(() -> new RuntimeException("Error: Manager is not found."));
                        roles.add(managerRole);
                        break;
                    case "create":
                        Role createRole = roleRepository.findByName(ERole.ROLE_CREATE)
                                .orElseThrow(() -> new RuntimeException("Error: Create role is not found."));
                        roles.add(createRole);
                        break;
                    case "read":
                        Role readRole = roleRepository.findByName(ERole.ROLE_READ)
                                .orElseThrow(() -> new RuntimeException("Error: Read role is not found."));
                        roles.add(readRole);
                        break;
                    case "update":
                        Role updateRole1 = roleRepository.findByName(ERole.ROLE_UPDATE)
                                .orElseThrow(() -> new RuntimeException("Error: Update role is not found."));
                        roles.add(updateRole1);
                        break;
                    case "delete":
                        Role deleteRole = roleRepository.findByName(ERole.ROLE_DELETE)
                                .orElseThrow(() -> new RuntimeException("Error: Delete role is not found."));
                        roles.add(deleteRole);
                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: UserDefault is not found."));
                        roles.add(userRole);
                }
            });
        }
        newUser.setRoles(roles);
        newUser.setManagementAt(user.getManagementAt());
        userRepository.save(newUser);
        return new ResponseEntity<>(newUser, HttpStatus.OK);
    }

    @PatchMapping("/manager/{id}")
    @PreAuthorize("(hasRole('MANAGER') and hasRole('UPDATE'))")
    public ResponseEntity<User> updateUserManager(@PathVariable String id, @RequestBody SignupRequest user) {
        User newUser = userRepository.findById(id).get();
        Set<String> strRoles = user.getRoles();
        Set<Role> roles = new HashSet<>();
        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "updater":
                        Role updateRole = roleRepository.findByName(ERole.ROLE_UPDATER)
                                .orElseThrow(() -> new RuntimeException("Error: Updater is not found."));
                        roles.add(updateRole);
                        break;
                    case "seller":
                        Role sellRole = roleRepository.findByName(ERole.ROLE_SELLER)
                                .orElseThrow(() -> new RuntimeException("Error: Seller is not found."));
                        roles.add(sellRole);
                        break;
                    case "create":
                        Role createRole = roleRepository.findByName(ERole.ROLE_CREATE)
                                .orElseThrow(() -> new RuntimeException("Error: Create role is not found."));
                        roles.add(createRole);
                        break;
                    case "read":
                        Role readRole = roleRepository.findByName(ERole.ROLE_READ)
                                .orElseThrow(() -> new RuntimeException("Error: Read role is not found."));
                        roles.add(readRole);
                        break;
                    case "update":
                        Role updateRole1 = roleRepository.findByName(ERole.ROLE_UPDATE)
                                .orElseThrow(() -> new RuntimeException("Error: Update role is not found."));
                        roles.add(updateRole1);
                        break;
                    case "delete":
                        Role deleteRole = roleRepository.findByName(ERole.ROLE_DELETE)
                                .orElseThrow(() -> new RuntimeException("Error: Delete role is not found."));
                        roles.add(deleteRole);
                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: UserDefault is not found."));
                        roles.add(userRole);
                }
            });
        }
        newUser.setRoles(roles);
        newUser.setManagementAt(user.getManagementAt());
        userRepository.save(newUser);
        return new ResponseEntity<>(newUser, HttpStatus.OK);
    }

    @PatchMapping("/user/{id}")
    public ResponseEntity<User> changeInfoUser(@PathVariable String id, @RequestBody SignupRequest user) {
        User newUser = userRepository.findById(id).get();

        newUser.setEmail(user.getEmail());
        newUser.setFullName(user.getFullName());
        newUser.setAddress(user.getAddress());
        newUser.setPhone(user.getPhone());
        userRepository.save(newUser);
        return new ResponseEntity<>(newUser, HttpStatus.OK);
    }

    @GetMapping("/checkPassword/{id}/{password}")
    public ResponseEntity<?> checkPassword(@PathVariable String id, @PathVariable String password) {
        User newUser = userRepository.findById(id).get();
        BCryptPasswordEncoder bc = new BCryptPasswordEncoder();
        boolean passChecker = bc.matches(password, newUser.getPassword());
        return new ResponseEntity<>(passChecker, HttpStatus.OK);
    }

    @PatchMapping("/account/{id}")
    public ResponseEntity<?> changeAccountUser(@PathVariable String id, @RequestBody SignupRequest user) {
        User newUser = userRepository.findById(id).get();
        newUser.setUsername(user.getUsername());
        newUser.setPassword(encoder.encode(user.getPassword()));
        userRepository.save(newUser);
        return new ResponseEntity<>(newUser, HttpStatus.OK);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Tài khoản đã tồn tại! Vui lòng chọn tài khoản mới!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Email đã tồn tại!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                signUpRequest.getPhone(),
                signUpRequest.getFullName(),
                signUpRequest.getAddress(),
                encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Đăng ký tài khoản thành công!"));
    }

    @PostMapping("/deleteRole/{userId}")
    public ResponseEntity<?> deleteRoleOfUser(@PathVariable String userId) {
        Optional<User> user = userRepository.findById(userId);
        Set<Role> roles = new HashSet<>();

            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);

        user.get().setRoles(roles);
        return ResponseEntity.ok(new MessageResponse("Thành công!"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') and hasRole('DELETE')")
    public ResponseEntity<HttpStatus> delete(@PathVariable("id") String id) {
        try {
            userRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/forgot-password/{email}")
    public String forgotPassword(@PathVariable String email) {

        String response = userService.forgotPassword(email);

        return response;
    }

    @PutMapping("/reset-password/{token}/{password}")
    public String resetPassword(@PathVariable String token,
                                @PathVariable String password) {

        return userService.resetPassword(token, password);
    }

    @GetMapping("/userManager/{idBranch}")
    @PreAuthorize("hasRole('MANAGER') and hasRole('READ')")
    public ResponseEntity<List<?>> listUserManager(@PathVariable String idBranch) {
        try {
            List<User> users = new ArrayList<>(userRepository.findAll());
            List<User> userList = users.stream().filter(user -> user.getRoles().stream().anyMatch(role -> "6439275da3b6e3c4aedc88a9".equals(role.getId()) || "643925d29469fdc6afcf9850".equals(role.getId()) || "643925899469fdc6afcf984e".equals(role.getId()))).collect(Collectors.toList());
            List<User> userList1 = userList.stream().filter(user -> user.getManagementAt() == null || idBranch.equals(user.getManagementAt())).collect(Collectors.toList());
            return new ResponseEntity<>(userList1, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}