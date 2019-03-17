DROP TABLE IF EXISTS "time_off_request";
DROP TABLE IF EXISTS "batch_of_requests";
DROP TABLE IF EXISTS "accrued_time";
DROP TABLE IF EXISTS "employee";
DROP TABLE IF EXISTS "role";
DROP TABLE IF EXISTS "type";
DROP TABLE IF EXISTS "request_status";

-- Differentiate roles between administators and employees
CREATE TABLE "role"
(
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(20) NOT NULL
);

INSERT INTO "role"
	("name")
VALUES
	('admin'),
	('employee');

-- Type of leave
CREATE TABLE "type"
(
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(20) NOT NULL
);

INSERT INTO "type"
	("name")
VALUES
	('Vacation'),
	('Sick and Safe Leave');

-- Status of a batch of requests
CREATE TABLE "request_status"
(
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(20) NOT NULL
);

INSERT INTO "request_status"
	("name")
VALUES
	('pending'),
	('approved'),
	('denied');

-- Employee data
CREATE TABLE "employee"
(
	"id" SERIAL PRIMARY KEY,
	"username" VARCHAR (80) UNIQUE NOT NULL,
	"password" VARCHAR (1000) NOT NULL,
	"email" VARCHAR(75) UNIQUE NOT NULL,
	"first_name" VARCHAR(25) NOT NULL,
	"last_name" VARCHAR(25) NOT NULL,
	"company_employee_id" VARCHAR(10),
	"sick_hours" INTEGER NOT NULL DEFAULT 0,
	"vacation_hours" INTEGER NOT NULL DEFAULT 0,
	"role_id" INTEGER REFERENCES "role"("id") DEFAULT 2,
	"start_date" DATE NOT NULL,
	"is_active" BOOLEAN DEFAULT true
);

INSERT INTO "employee"
	("username", "password", "email", "first_name", "last_name", "company_employee_id", "sick_hours", "vacation_hours", "role_id", "start_date", "is_active")
VALUES
	('michael', '$2b$10$oy0t5N4snauzLT7NOWYknuD9AT1Xv2yGfACuBrhjufylt3nOBjERe', 'MichaelOne@gmail.com', 'Michael', 'One', '11111', 65, 55, 1, '2005-05-01', true),
	('sarah', '$2b$10$oy0t5N4snauzLT7NOWYknuD9AT1Xv2yGfACuBrhjufylt3nOBjERe', 'SarahDavis@gmail.com', 'Sarah', 'Davis', '12345', 65, 55, 2, '2015-03-23', true),
	('joshua', '$2b$10$oy0t5N4snauzLT7NOWYknuD9AT1Xv2yGfACuBrhjufylt3nOBjERe', 'JoshuaEsmay@gmail.com', 'Joshua', 'Esmay', '44444', 65, 55, 2, '2012-11-19', false),
	('leo', '$2b$10$oy0t5N4snauzLT7NOWYknuD9AT1Xv2yGfACuBrhjufylt3nOBjERe', 'LeoEspinoza@gmail.com', 'Leo', 'Espinoza', '43263', 65, 55, 2, '2018-09-28', true),
	('garrett', '$2b$10$oy0t5N4snauzLT7NOWYknuD9AT1Xv2yGfACuBrhjufylt3nOBjERe', 'GarrettFitzgerald@gmail.com', 'Garrett', 'Fitzgerald', '89375', 65, 55, 2, '2010-12-02', true),
	('andrew', '$2b$10$oy0t5N4snauzLT7NOWYknuD9AT1Xv2yGfACuBrhjufylt3nOBjERe', 'AndrewGordon@gmail.com', 'Andrew', 'Gordon', '23629', 65, 55, 2, '2008-10-14', false),
	('chelsea', '$2b$10$oy0t5N4snauzLT7NOWYknuD9AT1Xv2yGfACuBrhjufylt3nOBjERe', 'ChelseaSchmitz@gmail.com', 'Chelsea', 'Schmitz', '90285', 65, 55, 2, '2011-07-30', true);

-- Keeps track of vacation/sick time earned
CREATE TABLE "accrued_time"
(
	"id" SERIAL PRIMARY KEY,
	"year" DATE DEFAULT NOW() NOT NULL,
	"sick_hours" INTEGER NOT NULL,
	"vacation_hours" INTEGER NOT NULL,
	"employee_id" INTEGER REFERENCES "employee"("id")
);

INSERT INTO "accrued_time"
	("year", "sick_hours", "vacation_hours", "employee_id")
VALUES
	('2019-01-01', 80, 45, 1),
	('2019-01-01', 80, 50, 2),
	('2019-01-01', 80, 55, 3),
	('2019-01-01', 80, 68, 4),
	('2019-01-01', 80, 61, 5),
	('2019-01-01', 80, 54, 6),
	('2019-01-01', 80, 62, 7);

-- Groups one or more entries in "time_off_request" into a single transaction
CREATE TABLE "batch_of_requests"
(
	"id" SERIAL PRIMARY KEY,
	"employee_id" INTEGER REFERENCES "employee"("id"),
	"date_requested" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "type_id" INTEGER REFERENCES "type"("id"), 
    "request_status_id" INTEGER REFERENCES "request_status"("id") DEFAULT 1,
	"notes" VARCHAR(250)
);

	INSERT INTO "batch_of_requests"
		("employee_id", "date_requested", "type_id", "request_status_id")
	VALUES
		(1, '2019-03-11', 2, 1),
		(2, '2019-03-09', 1, 1),
		(3, '2019-02-11', 1, 1),
		(5, '2019-03-07', 1, 3),
		(1, '2019-03-10', 2, 2),
		(2, '2019-03-05', 1, 2);

	-- Stores time off request data
	CREATE TABLE "time_off_request"
	(
		"id" SERIAL PRIMARY KEY,
		"date" DATE NOT NULL,
		"batch_of_requests_id" INTEGER REFERENCES "batch_of_requests"("id"),
		"hours" INTEGER NOT NULL
	);

	INSERT INTO "time_off_request"
		("date", "batch_of_requests_id", "hours")
	VALUES
		('2019-03-12', 1, 8),
		('2019-03-13', 1, 8),
		('2019-03-14', 1, 8),
		('2019-03-15', 1, 8),
		('2019-03-16', 1, 8),
		('2019-04-12', 2, 8),
		('2019-04-13', 2, 8),
		('2019-04-14', 2, 4),
		('2019-05-12', 3, 4),
		('2019-05-13', 3, 4),
		('2019-03-12', 4, 8),
		('2019-03-13', 4, 8),
		('2019-03-14', 4, 8),
		('2019-03-15', 4, 8),
		('2019-03-16', 4, 8),
		('2019-04-12', 5, 8),
		('2019-04-13', 5, 8),
		('2019-04-14', 5, 4),
		('2019-05-12', 6, 4),
		('2019-05-13', 6, 4);