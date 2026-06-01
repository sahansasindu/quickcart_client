# Quickcart Client

 <img width="1670" height="913" alt="image" src="https://github.com/user-attachments/assets/8e72db2e-cc83-46d3-93ab-70dc4d04e69d" />
 <img width="1899" height="898" alt="image" src="https://github.com/user-attachments/assets/b2155fed-4224-4e63-88cb-d9276045ad0f" />


----------------------------------------------------------------------------------------------------------------------
 
 ![Architecture Diagram](https://github.com/user-attachments/assets/8cdca14d-77a1-4df4-85a5-5f2f1ffe3e50)

----------------------------------------------------------------------------------------------------------------------

## Features

- Product management
- Category management
- Shopping cart functionality
- Product reviews and ratings
- Discount handling
- Bookmark/favorite products
- order management.
- payment gateway.
- user handle.


## System Architecture

This project follows a **microservices architecture** with the following core components:

### Keycloak(https://www.keycloak.org/documentation)
Used as an **Identity and Access Management (IAM)** solution.

- Handles authentication and authorization
- Provides secure login and token-based access

<img width="1659" height="757" alt="image" src="https://github.com/user-attachments/assets/99db1e65-ed52-4906-9dfd-f5d9328e9a3b" />


---

### Eureka Server (https://github.com/sahansasindu/eureka-service-api)
Used as a **Service Registry**.

- Registers all microservices
- Enables dynamic service discovery

<img width="1657" height="903" alt="image" src="https://github.com/user-attachments/assets/145994dd-a0a2-4ef8-9790-bf14d0f6a704" />


---

### API Gateway (https://github.com/sahansasindu/quickcart_gateway)
Acts as the **entry point** for all client requests.

- Routes requests to appropriate services
- Integrates with Keycloak for security
- Handles cross-cutting concerns

---

## Frontend Clients

- **User Client (Angular)** → Used by normal users (https://github.com/sahansasindu/quickcart_client)
- **Admin Client (React)** → Used by administrators (https://github.com/sahansasindu/Quick-Cart-Admin)

---

## API'S

- Order Service API (https://github.com/sahansasindu/order-service-api)
- User Service APT  (https://github.com/sahansasindu/user-service-api)
- Product Service API (https://github.com/sahansasindu/product-service-api)
- Util Service API

---




