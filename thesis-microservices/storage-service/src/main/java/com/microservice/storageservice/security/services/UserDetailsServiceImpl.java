package com.microservice.storageservice.security.services;

import com.microservice.storageservice.entities.Image;
import com.microservice.storageservice.proxy.AuthorProxy;
import com.microservice.storageservice.security.models.User;
import com.microservice.storageservice.util.ImageUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.io.IOException;
import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

	@Autowired
	private AuthorProxy authorProxy;
	@GetMapping("/{username}")
	public User getUser(@PathVariable String username){
		return authorProxy.retrieveUser(username);
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = authorProxy.retrieveUser(username);
		return UserDetailsImpl.build(user);
	}

}
