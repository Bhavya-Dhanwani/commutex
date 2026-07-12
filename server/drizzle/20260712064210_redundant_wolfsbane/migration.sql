CREATE TYPE "driver_status" AS ENUM('Available', 'On Trip', 'Off Duty', 'Suspended');--> statement-breakpoint
CREATE TYPE "expense_category" AS ENUM('Fuel', 'Maintenance', 'Toll', 'Parking', 'Insurance', 'Fine', 'Other');--> statement-breakpoint
CREATE TYPE "maintenance_status" AS ENUM('Active', 'Completed');--> statement-breakpoint
CREATE TYPE "trip_status" AS ENUM('Draft', 'Dispatched', 'Completed', 'Cancelled');--> statement-breakpoint
CREATE TYPE "role" AS ENUM('Admin', 'Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst', 'User');--> statement-breakpoint
CREATE TYPE "vehicle_status" AS ENUM('Available', 'On Trip', 'In Shop', 'Retired');--> statement-breakpoint
CREATE TYPE "vehicle_type" AS ENUM('Truck', 'Van', 'Mini Truck', 'Trailer', 'Container');--> statement-breakpoint
CREATE TABLE "drivers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(100) NOT NULL,
	"employee_id" varchar(50),
	"phone" varchar(20),
	"email" varchar(255),
	"address" varchar(255),
	"license_number" varchar(50) NOT NULL UNIQUE,
	"license_category" varchar(20),
	"license_expiry" timestamp,
	"safety_score" integer DEFAULT 100,
	"experience_years" integer,
	"status" "driver_status" DEFAULT 'Available'::"driver_status",
	"emergency_name" varchar(100),
	"emergency_phone" varchar(20),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"vehicle_id" uuid NOT NULL,
	"trip_id" uuid,
	"category" "expense_category" NOT NULL,
	"amount" numeric(10,2),
	"description" varchar(500),
	"expense_date" timestamp,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fuel_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"vehicle_id" uuid NOT NULL,
	"trip_id" uuid,
	"liters" numeric(8,2),
	"cost" numeric(10,2),
	"fuel_station" varchar(150),
	"odometer" integer,
	"filled_on" timestamp,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "maintenance_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"vehicle_id" uuid NOT NULL,
	"maintenance_type" varchar(100),
	"description" varchar(500),
	"workshop" varchar(150),
	"cost" numeric(10,2),
	"start_date" timestamp,
	"completed_date" timestamp,
	"status" "maintenance_status" DEFAULT 'Active'::"maintenance_status",
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"trip_number" varchar(30) NOT NULL UNIQUE,
	"vehicle_id" uuid NOT NULL,
	"driver_id" uuid NOT NULL,
	"source" varchar(255),
	"destination" varchar(255),
	"cargo_weight" integer,
	"planned_distance" integer,
	"actual_distance" integer,
	"dispatch_date" timestamp,
	"expected_arrival" timestamp,
	"completed_date" timestamp,
	"start_odometer" integer,
	"end_odometer" integer,
	"revenue" numeric(12,2),
	"fuel_consumed" numeric(8,2),
	"status" "trip_status" DEFAULT 'Draft'::"trip_status",
	"created_by" uuid,
	"remarks" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"role" "role" DEFAULT 'User'::"role" NOT NULL,
	"verification_token" varchar(255),
	"verification_expires" timestamp,
	"reset_password_token" varchar(255),
	"reset_password_expires" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"registration_number" varchar(30) NOT NULL UNIQUE,
	"model" varchar(100) NOT NULL,
	"type" "vehicle_type" NOT NULL,
	"max_load_capacity" integer NOT NULL,
	"odometer" integer DEFAULT 0,
	"acquisition_cost" numeric(12,2),
	"purchase_date" timestamp,
	"status" "vehicle_status" DEFAULT 'Available'::"vehicle_status",
	"region" varchar(100),
	"notes" text,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_vehicle_id_vehicles_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id");--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_trip_id_trips_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id");--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_created_by_users_id_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "fuel_logs" ADD CONSTRAINT "fuel_logs_vehicle_id_vehicles_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id");--> statement-breakpoint
ALTER TABLE "fuel_logs" ADD CONSTRAINT "fuel_logs_trip_id_trips_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id");--> statement-breakpoint
ALTER TABLE "fuel_logs" ADD CONSTRAINT "fuel_logs_created_by_users_id_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "maintenance_logs" ADD CONSTRAINT "maintenance_logs_vehicle_id_vehicles_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id");--> statement-breakpoint
ALTER TABLE "maintenance_logs" ADD CONSTRAINT "maintenance_logs_created_by_users_id_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_vehicle_id_vehicles_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id");--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_driver_id_drivers_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id");--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_created_by_users_id_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_created_by_users_id_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id");