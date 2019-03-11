CREATE TABLE "person"
(
	"id" SERIAL PRIMARY KEY,
	"username" VARCHAR (80) UNIQUE NOT NULL,
	"password" VARCHAR (1000) NOT NULL
);

-- Will show list of all employees
CREATE TABLE "employee"
(
	"id" SERIAL PRIMARY KEY,
	"email" VARCHAR(75) UNIQUE NOT NULL,
	"first_name" VARCHAR(25) NOT NULL,
	"last_name" VARCHAR(25) NOT NULL,
	"company_employee_id" VARCHAR(10) UNIQUE NOT NULL,
	"role_id" INTEGER REFERENCES "role"("id"),
	"start_date" DATE NOT NULL,
	"is_active" BOOLEAN NOT NULL
);

-- Will differenciate an admin from an employee
CREATE TABLE "role"
(
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(20) NOT NULL
);

-- Keeps track of vacation/sick time earned
CREATE TABLE "accrued_time"
(
	"id" SERIAL PRIMARY KEY,
	"year" DATE NOT NULL,
	"sick_time" INTEGER NOT NULL,
	"vacation_time" INTEGER NOT NULL,
	"employee_id" INTEGER REFERENCES "employee"("id")
);

-- Stores time off request data
CREATE TABLE "time_off_request"
(
	"id" SERIAL PRIMARY KEY,
	"date" DATE NOT NULL,
	"batch_of_requests_id" INTEGER REFERENCES "batch_of_requests"("id"),
	"hours" INTEGER NOT NULL
);

-- Groups one or more entries in "time_off_request" into a single transaction
CREATE TABLE "batch_of_requests"
(
	"id" SERIAL PRIMARY KEY,
	"employee_id" INTEGER REFERENCES "employee"("id"),
	"date_requested" TIMESTAMP
	WITH TIME ZONE NOT NULL DEFAULT NOW
	(),
    "type_id" INTEGER REFERENCES "type"
	("id"),
    "approved" BOOLEAN NOT NULL DEFAULT false
);

	-- Type of leave
	CREATE TABLE "type"
	(
		"id" SERIAL PRIMARY KEY,
		"name" VARCHAR(20) NOT NULL
	);
