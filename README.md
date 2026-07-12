# Commutex

Commutex is a comprehensive fleet and transport management system designed to optimize logistics operations. The platform enables organizations to manage vehicles, drivers, trips, fuel consumption, maintenance logs, and financial expenses through a unified interface. It features dynamic database-driven permissions that allow administrators to control module access for various roles.

Live Application: https://commutex.codedemons.in

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database instance

### Database Setup

Ensure your local or remote PostgreSQL database is running before proceeding.

### Backend Setup

1. Navigate to the server directory:

```bash
cd server
```

2. Install the backend dependencies:

```bash
npm install
```

3. Copy the template environment file:

```bash
cp .env.example .env
```

4. Update the environment variables in the newly created `.env` file with your database credentials and secret keys.

5. Apply database migrations and seed default data:

```bash
npm run db:up
```

Wait for the containers to run, then migrate and seed:

```bash
npm run db:migrate
```

```bash
npm run db:seed
```

6. Start the backend development server:

```bash
npm run dev
```

### Frontend Setup

1. Navigate to the client directory:

```bash
cd client
```

2. Install the frontend dependencies:

```bash
npm install
```

3. Copy the template environment file:

```bash
cp .env.example .env
```

4. Set the backend API URL inside the `.env` file if necessary.

5. Start the frontend development server:

```bash
npm run dev
```

## Database Schemas

The system uses Drizzle ORM to manage the database structure. Key tables include:

- **Users**: Stores credentials and reference to roles.
- **Roles**: Manages custom roles (e.g. Fleet Manager, Dispatcher, Safety Officer, Financial Analyst, User).
- **Permissions**: Defines toggleable feature access (Analytics, Vehicles, Drivers, Trips, Maintenance, Fuel, Expenses, Users, Settings) mapped to specific roles.
- **Vehicles**: Contains registration, capacity, status, and odometer details.
- **Drivers**: Keeps track of driver details, licenses, status, and safety ratings.
- **Trips**: Logs trip routes, states (Draft, Dispatched, Completed, Cancelled), vehicle/driver pairings, and metrics.
- **Maintenance Logs**: Tracks repairs, workshops, costs, and servicing states.
- **Fuel Logs**: Tracks fuel purchases, quantities, prices, and locations.
- **Expenses**: Logs overall trip-related and fleet-related expenditures.

## API Architecture

All endpoints are prefix-mounted under `/api` and secured based on token authentication and dynamic feature-level authorization checks.

### Authentication Endpoints

- `POST /api/auth/register` (Register a new user)
- `POST /api/auth/login` (Authenticate credentials and retrieve access tokens)
- `POST /api/auth/refresh` (Request a new access token using a refresh token)
- `GET /api/auth/me` (Fetch profile details of the current logged-in user)

### Dynamic Role and Permission Administration

- `GET /api/roles` (List configurable roles and current permission checks)
- `PATCH /api/roles/:id/permissions` (Check or uncheck access options for a specific role)

### User Management

- `GET /api/users` (List all registered users; supports fuzzy searches)
- `GET /api/users/:id` (Fetch details of a specific user)
- `PATCH /api/users/:id/role` (Update a user's role assignment; admins cannot self-modify)

### Vehicle Fleet Management

- `GET /api/vehicles` (List vehicles; filterable by search term)
- `GET /api/vehicles/:id` (Retrieve single vehicle details)
- `POST /api/vehicles` (Add a new vehicle)
- `PATCH /api/vehicles/:id` (Update vehicle specifications)

### Driver Operations

- `GET /api/drivers` (Retrieve list of drivers; filterable by search term)
- `GET /api/drivers/:id` (Fetch driver records)
- `POST /api/drivers` (Add a new driver)
- `PATCH /api/drivers/:id` (Modify driver profiles)

### Trip Logistics

- `GET /api/trips` (Retrieve trip logs; filterable by search term)
- `GET /api/trips/:id` (View single trip detail)
- `POST /api/trips` (Create a Draft trip; validates payload limits and vehicle/driver availability)
- `PATCH /api/trips/:id` (Update trip records)
- `PATCH /api/trips/:id/dispatch` (Lock vehicle and driver to On Trip and record start metrics)
- `PATCH /api/trips/:id/complete` (Release vehicle and driver and store final odometer and revenue data)
- `PATCH /api/trips/:id/cancel` (Restore driver and vehicle states and cancel dispatch)

### Maintenance Operations

- `GET /api/maintenance` (List maintenance events; filterable by search term)
- `GET /api/maintenance/:id` (Retrieve details of a maintenance log)
- `POST /api/maintenance` (Log new maintenance log)
- `PATCH /api/maintenance/:id` (Update maintenance event details)
- `PATCH /api/maintenance/:id/start` (Transition vehicle status to In Shop)
- `PATCH /api/maintenance/:id/complete` (Return vehicle to Available status and record cost/workshop details)

### Fuel Tracking

- `GET /api/fuel-logs` (List fuel entries; filterable by search term)
- `GET /api/fuel-logs/:id` (Retrieve details of a fuel purchase)
- `POST /api/fuel-logs` (Log a fuel receipt)
- `PATCH /api/fuel-logs/:id` (Edit a fuel receipt details)

### General Expenses

- `GET /api/expenses` (List expense records; filterable by search term)
- `GET /api/expenses/:id` (Retrieve single expense detail)
- `POST /api/expenses` (Create an expense log)
- `PATCH /api/expenses/:id` (Update an expense log details)

### Fleet Analytics

- `GET /api/analytics/fleet-utilization` (Retrieve operational vehicle statistics and utilization rates)
- `GET /api/analytics/fuel-efficiency` (Analyze vehicle distance and consumption averages)
- `GET /api/analytics/vehicle-roi` (Compute return on investment based on revenues, acquisition costs, and maintenance logs)
- `GET /api/analytics/expenses` (Analyze expense breakdowns by category and trends)
- `GET /api/analytics/revenue` (Track revenue breakdowns and trends over time)
- `GET /api/analytics/maintenance` (Review maintenance costs and type frequencies)
- `GET /api/analytics/recent` (Fetch recent logs of trips, maintenance tasks, and expenses)
