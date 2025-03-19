# Garage Application API

A RESTful API for a garage application that facilitates customer and garage onboarding, management, and interaction.

## Features

- User authentication and authorization (JWT)
- Customer onboarding and management
- Garage onboarding and management
- Vehicle registration and tracking
- Service management
- Reviews and ratings
- Geolocation-based garage search

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose ODM
- JWT Authentication

## Installation and Setup

1. Clone the repository
   ```
   git clone <repository-url>
   cd garage-app-api
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Configure environment variables
   - Create a `.env` file in the root directory
   - Add the required environment variables (see `.env.example`)

4. Start the development server
   ```
   npm run dev
   ```

5. For production
   ```
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register/:userType` - Register a new user (customer or garage)
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Customers

- `PUT /api/customers/profile` - Update customer profile
- `POST /api/customers/vehicles` - Add a vehicle
- `GET /api/customers/vehicles` - Get all customer vehicles
- `GET /api/customers/garages/nearby` - Find nearby garages
- `POST /api/customers/preferred-garages/:garageId` - Add a garage to preferred list
- `POST /api/customers/reviews/:garageId` - Submit a review for a garage

### Garages

- `PUT /api/garages/profile` - Update garage profile
- `POST /api/garages/services` - Add a service
- `GET /api/garages/services` - Get all garage services
- `PUT /api/garages/hours` - Update business hours
- `PUT /api/garages/specialties` - Update specialties
- `GET /api/garages/reviews` - Get garage reviews

## License

MIT