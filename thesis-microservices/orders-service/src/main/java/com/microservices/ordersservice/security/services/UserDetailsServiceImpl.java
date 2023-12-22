package com.microservices.ordersservice.security.services;

import com.microservices.ordersservice.proxy.AuthorProxy;
import com.microservices.ordersservice.security.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

	@Autowired
	private AuthorProxy authorProxy;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = authorProxy.retrieveUser(username);
		return UserDetailsImpl.build(user);
	}

}
