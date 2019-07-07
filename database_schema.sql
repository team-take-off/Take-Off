DROP TABLE IF EXISTS transaction_log;
DROP TABLE IF EXISTS time_off_request;
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS employee_role;
DROP TABLE IF EXISTS leave_type;
DROP TABLE IF EXISTS request_status;
DROP TABLE IF EXISTS transaction_type;

-- Differentiate roles between administators and employees
CREATE TABLE employee_role (
	id SERIAL PRIMARY KEY
	, title VARCHAR(20) NOT NULL
);
INSERT INTO employee_role
	(title)
VALUES
	('admin'),
	('employee');

-- Type of leave
CREATE TABLE leave_type (
	id SERIAL PRIMARY KEY
	, val VARCHAR(20) NOT NULL
);
INSERT INTO leave_type
	(val)
VALUES
	('Vacation'),
	('Sick and Safe Leave');

-- Status of a request for time off
CREATE TABLE request_status (
	id SERIAL PRIMARY KEY
	, val VARCHAR(20) NOT NULL
);
INSERT INTO request_status
	(val)
VALUES
	('pending'),
	('approved'),
	('denied');

-- Types of a transactions in the log table
CREATE TABLE transaction_type (
	id SERIAL PRIMARY KEY
	, val VARCHAR(20) NOT NULL
);
INSERT INTO transaction_type
	(val)
VALUES
	('automatic accrual'),
	('automatic adjustment'),
	('employee request'),
	('employee cancel'),
	('admin approve'),
	('admin deny'),
	('admin for employee');

-- Employee data
CREATE TABLE employee (
	id SERIAL PRIMARY KEY
	, email VARCHAR(100) UNIQUE NOT NULL
	, first_name VARCHAR(25) NOT NULL
	, last_name VARCHAR(25) NOT NULL
	, sick_hours INTEGER NOT NULL DEFAULT 0
	, vacation_hours INTEGER NOT NULL DEFAULT 0 CHECK(vacation_hours >= 0)
	, role_id INTEGER NOT NULL REFERENCES employee_role(id) DEFAULT 2
	, started_date DATE NOT NULL
	, is_active BOOLEAN NOT NULL DEFAULT true
);

-- An employee's request for time off
CREATE TABLE time_off_request (
	id SERIAL PRIMARY KEY
	, employee_id INTEGER NOT NULL REFERENCES employee(id)
	, leave_type_id INTEGER NOT NULL REFERENCES leave_type(id)
	, start_datetime TIMESTAMPTZ NOT NULL
	, end_datetime TIMESTAMPTZ NOT NULL
	, placed_datetime TIMESTAMPTZ NOT NULL DEFAULT NOW()
	, CONSTRAINT end_after_start CHECK(end_datetime > start_datetime)
	, CONSTRAINT exclude_overlapping_requests EXCLUDE USING gist(int4range(employee_id, employee_id, '[]') WITH =, tstzrange(start_datetime, end_datetime) WITH &&)
);

CREATE TABLE transaction_log (
	id SERIAL PRIMARY KEY
	, employee_id INTEGER NOT NULL REFERENCES employee(id)
	, hours_changed INTEGER NOT NULL
	, leave_type_id INTEGER NOT NULL REFERENCES leave_type(id)
	, transaction_type_id INTEGER NOT NULL REFERENCES transaction_type(id)
	, final BOOLEAN NOT NULL
	, transaction_datetime TIMESTAMPTZ NOT NULL DEFAULT NOW()
)