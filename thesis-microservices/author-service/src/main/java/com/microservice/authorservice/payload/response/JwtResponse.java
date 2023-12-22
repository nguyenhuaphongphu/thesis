package com.microservice.authorservice.payload.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class JwtResponse {
	private String token;
	private String type = "Bearer";
	private String id;
	private List<String> roles;
	private String managementAt;

	public JwtResponse(String accessToken, String id,List<String> roles, String managementAt) {
		this.token = accessToken;
		this.id = id;
		this.roles = roles;
		this.managementAt = managementAt;
	}
}
