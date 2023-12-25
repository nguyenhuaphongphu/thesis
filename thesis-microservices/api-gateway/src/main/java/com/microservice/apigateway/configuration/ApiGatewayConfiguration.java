package com.microservice.apigateway.configuration;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApiGatewayConfiguration {

    @Bean
    public RouteLocator gatewayRouter(RouteLocatorBuilder builder) {
        return builder.routes()
                .route(p -> p.path("/get")
                        .filters(f -> f
                                .addRequestHeader("MyHeader", "MyURI")
                                .addRequestParameter("Param", "MyValue"))
                        .uri("http://httpbin.org:80"))
//For branches-service
                .route(p -> p.path("/branch/**")
                        .uri("lb://branches"))
                .route(p -> p.path("/brand/**")
                        .uri("lb://branches"))
                .route(p -> p.path("/product/**")
                        .uri("lb://branches"))
                .route(p -> p.path("/review/**")
                        .uri("lb://branches"))
                .route(p -> p.path("/supplier/**")
                        .uri("lb://branches"))
                .route(p -> p.path("/typeOfProduct/**")
                        .uri("lb://branches"))
                .route(p -> p.path("/tag/**")
                        .uri("lb://branches"))
//For authors-service
                .route(p -> p.path("/auth/**")
                        .uri("lb://author"))
//For orders-service
                .route(p -> p.path("/bill/**")
                        .uri("lb://orders"))
                .route(p -> p.path("/importOrder/**")
                        .uri("lb://orders"))
//For storage-service
                .route(p -> p.path("/images/**")
                        .uri("lb://storage"))

//For email-service
                .route(p -> p.path("/email/**")
                        .uri("lb://email"))
                .route(p -> p.path("/emailByBranch/**")
                        .uri("lb://email"))
                .route(p -> p.path("/infoCustomer/**")
                        .uri("lb://email"))

//For recommendation-service
            //hello
                .route(p -> p.path("/transpose/**")
                        .uri("lb://recommendation"))
                .build();
    }
}
