# FoodShare Process Report

## 1. Project Overview
FoodShare is a full-stack food donation platform that connects donors with NGOs, volunteers, and administrators. The repository contains:

- Frontend: Vite + React project
- Backend: Spring Boot microservices project
- Deployment: Vercel-friendly frontend and Java service backend

## 2. Project Modules
### Frontend
- `src/` : React pages, route registry, application state, styles, and API logic
- `public/` : static assets and legacy resources
- `index.html` : app entry
- `package.json` : frontend scripts and dependencies

### Backend
- `Backend/service-registry/` : Eureka discovery
- `Backend/api-gateway/` : central API routing layer
- `Backend/auth-service/` : registration and login
- `Backend/food-service/` : donation/food listing management
- `Backend/user-service/` : user profiles and management
- `Backend/request-service/` : request workflows
- `Backend/payment_service/` : payment flow
- `password-reset-service/` : password reset service area

## 3. Frontend Process
1. Install dependencies
   ```bash
   npm install
   ```
2. Run in development mode
   ```bash
   npm run dev
   ```
3. Validate build and production readiness
   ```bash
   npm run build
   npm run check
   npm run preview
   ```
4. Set API base if needed
   ```bash
   VITE_API_BASE_URL=http://localhost:8079/api npm run dev
   ```

## 4. Backend Process
1. Create required MySQL databases:
   - `foodshare_auth_db`
   - `foodshare_food_db`
   - `foodshare_user_db`
2. Set datasource configuration in each service.
3. Start services in order:
   - service-registry
   - api-gateway
   - auth-service
   - food-service
   - user-service
   - request-service
   - payment_service
4. Verify on Eureka dashboard at `http://localhost:8761/`
5. Use the gateway endpoint `http://localhost:8079/api`

## 5. Functional Flow
- Donor registers and posts food items
- Food service stores the listings
- NGO/volunteer views available food
- Auth service handles login and JWT issuance
- Request/payment modules complete the lifecycle

## 6. Risks and Observations
- Auth and user services have overlapping responsibilities
- Password hash security should be enforced consistently
- Some scripts and port references may be outdated
- MySQL and service config must be validated before runtime usage

## 7. Final Recommendation
The project is structured as a modern food donation platform with separate frontend/backend responsibilities. To run successfully, the developer should keep the MySQL environment ready, start services in the correct order, and validate the frontend against the active API gateway before deployment.
