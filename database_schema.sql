DROP TABLE IF EXISTS transaction_log;
DROP TABLE IF EXISTS collision;
DROP TABLE IF EXISTS request_unit;
DROP TABLE IF EXISTS time_off_request;
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS employee_role;
DROP TABLE IF EXISTS leave_type;
DROP TABLE IF EXISTS request_status;
DROP TABLE IF EXISTS transaction_type;

-- Differentiate roles between administators and employees
CREATE TABLE employee_role (
	id SERIAL PRIMARY KEY
	, title VARCHAR(20) NOT NULL UNIQUE
);
INSERT INTO employee_role
	(title)
VALUES
	('admin'),
	('employee');

-- Type of leave
CREATE TABLE leave_type (
	id SERIAL PRIMARY KEY
	, val VARCHAR(20) NOT NULL UNIQUE
);
INSERT INTO leave_type
	(val)
VALUES
	('Vacation'),
	('Sick and Safe Leave');

-- Status of a request for time off
CREATE TABLE request_status (
	id SERIAL PRIMARY KEY
	, val VARCHAR(20) NOT NULL UNIQUE
	, active INT NOT NULL
);
INSERT INTO request_status
	(val, active)
VALUES
	('pending', 1),
	('approved', 1),
	('denied', 0);

-- Types of a transactions in the log table
CREATE TABLE transaction_type (
	id SERIAL PRIMARY KEY
	, val VARCHAR(20) NOT NULL UNIQUE
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
	('admin special');

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
	, request_status_id INTEGER NOT NULL REFERENCES request_status(id)
	, active INT NOT NULL DEFAULT 1
	, start_datetime TIMESTAMPTZ NOT NULL
	, end_datetime TIMESTAMPTZ NOT NULL
	, placed_datetime TIMESTAMPTZ NOT NULL DEFAULT NOW()
	, CONSTRAINT end_after_start CHECK(end_datetime >= start_datetime)
	, CONSTRAINT exclude_overlapping_requests EXCLUDE USING gist(int4range(employee_id, employee_id, '[]') WITH =, tstzrange(start_datetime, end_datetime) WITH &&, int4range(0, active, '()') WITH &&)
	, CONSTRAINT denied_status_implies_not_active CHECK((request_status_id != 3 AND active = 1) OR (request_status_id = 3 AND active = 0))
);

-- A single discrete unit with a time off request (usually a day or half day)
CREATE TABLE request_unit (
	id SERIAL PRIMARY KEY
	, time_off_request_id INTEGER NOT NULL REFERENCES time_off_request(id) ON DELETE CASCADE
	, start_datetime TIMESTAMPTZ NOT NULL
	, end_datetime TIMESTAMPTZ NOT NULL
	, CONSTRAINT end_after_start CHECK(end_datetime > start_datetime)
	, CONSTRAINT exclude_overlapping_units EXCLUDE USING gist(int4range(time_off_request_id, time_off_request_id, '[]') WITH =, tstzrange(start_datetime, end_datetime) WITH &&)
);

-- Overlap between different employees' requests
CREATE TABLE collision (
	request_1 INTEGER NOT NULL REFERENCES time_off_request(id) ON DELETE CASCADE
	, request_2 INTEGER NOT NULL REFERENCES time_off_request(id) ON DELETE CASCADE 
	, PRIMARY KEY (request_1, request_2)
);

-- A log of transactions made to the other tables
CREATE TABLE transaction_log (
	id SERIAL PRIMARY KEY
	, author_id INTEGER REFERENCES employee(id)
	, employee_id INTEGER NOT NULL REFERENCES employee(id)
	, leave_hours INTEGER NOT NULL
	, leave_type_id INTEGER NOT NULL REFERENCES leave_type(id)
	, transaction_type_id INTEGER NOT NULL REFERENCES transaction_type(id)
	, transaction_datetime TIMESTAMPTZ NOT NULL DEFAULT NOW()
);