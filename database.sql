DROP TABLE IF EXISTS time_off_request;
DROP TABLE IF EXISTS batch_of_requests;
DROP TABLE IF EXISTS accrued_time;
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS employee_role;
DROP TABLE IF EXISTS leave_type;
DROP TABLE IF EXISTS request_status;

-- Differentiate roles between administators and employees
CREATE TABLE employee_role
(
	id SERIAL PRIMARY KEY,
	title VARCHAR(20) NOT NULL
);

INSERT INTO employee_role
	(title)
VALUES
	('admin'),
	('employee');

-- Type of leave
CREATE TABLE leave_type
(
	id SERIAL PRIMARY KEY,
	val VARCHAR(20) NOT NULL
);

INSERT INTO leave_type
	(val)
VALUES
	('Vacation'),
	('Sick and Safe Leave');

-- Status of a batch of requested time off
CREATE TABLE request_status
(
	id SERIAL PRIMARY KEY,
	val VARCHAR(20) NOT NULL
);

INSERT INTO request_status
	(val)
VALUES
	('pending'),
	('approved'),
	('denied');

-- Employee data
CREATE TABLE employee
(
	id SERIAL PRIMARY KEY,
	username VARCHAR (80) DEFAULT NULL,
	login_password VARCHAR (1000) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	first_name VARCHAR(25) NOT NULL,
	last_name VARCHAR(25) NOT NULL,
	sick_hours INTEGER NOT NULL DEFAULT 0,
	vacation_hours INTEGER NOT NULL DEFAULT 0,
	role_id INTEGER REFERENCES employee_role(id) DEFAULT 2,
	started_date DATE NOT NULL,
	is_active BOOLEAN DEFAULT true
);

-- Keeps track of vacation/sick time earned
CREATE TABLE accrued_time
(
	id SERIAL PRIMARY KEY,
	date_accrued DATE DEFAULT NOW() NOT NULL,
	sick_hours INTEGER NOT NULL,
	vacation_hours INTEGER NOT NULL,
	employee_id INTEGER REFERENCES employee(id)
);

-- Groups one or more entries in "time_off_request" into a single transaction
CREATE TABLE batch_of_requests
(
	id SERIAL PRIMARY KEY,
	employee_id INTEGER REFERENCES employee(id),
	date_requested TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
	leave_type_id INTEGER REFERENCES leave_type(id),
	request_status_id INTEGER REFERENCES request_status(id) DEFAULT 1,
	notes VARCHAR(250)
);

-- Stores time off request data
CREATE TABLE time_off_request
(
	id SERIAL PRIMARY KEY,
	off_date DATE NOT NULL,
	batch_of_requests_id INTEGER REFERENCES batch_of_requests(id),
	off_hours INTEGER NOT NULL
);