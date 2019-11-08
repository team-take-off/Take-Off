DROP TABLE IF EXISTS transaction_log;
DROP TABLE IF EXISTS collision;
DROP INDEX IF EXISTS unit_request_idx;
DROP TABLE IF EXISTS request_unit;
DROP INDEX IF EXISTS request_employee_idx;
DROP TABLE IF EXISTS request;
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
	(id, title)
VALUES
	(1, 'admin'),
	(2, 'employee');

-- Type of leave
CREATE TABLE leave_type (
	id SERIAL PRIMARY KEY
	, val VARCHAR(20) NOT NULL UNIQUE
);
INSERT INTO leave_type
	(id, val)
VALUES
	(1, 'Vacation'),
	(2, 'Sick and Safe Leave');

-- Status of a request for time off
CREATE TABLE request_status (
	id SERIAL PRIMARY KEY
	, val VARCHAR(20) NOT NULL UNIQUE
);
INSERT INTO request_status
	(id, val)
VALUES
	(1, 'pending'),
	(2, 'approved'),
	(3, 'denied');

-- Types of a transactions in the log table
CREATE TABLE transaction_type (
	id SERIAL PRIMARY KEY
	, val VARCHAR(20) NOT NULL UNIQUE
);
INSERT INTO transaction_type
	(id, val)
VALUES
	(1, 'automatic accrual'),
	(2, 'automatic adjustment');

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
CREATE TABLE request (
	id SERIAL PRIMARY KEY
	, employee_id INTEGER NOT NULL REFERENCES employee(id)
	, leave_type_id INTEGER NOT NULL REFERENCES leave_type(id)
	, status_id INTEGER NOT NULL REFERENCES request_status(id)
	, active BOOLEAN NOT NULL DEFAULT TRUE
	, start_datetime TIMESTAMP NOT NULL
	, end_datetime TIMESTAMP NOT NULL
	, placed_datetime TIMESTAMP NOT NULL DEFAULT NOW()
	, CONSTRAINT end_after_start CHECK(end_datetime >= start_datetime)
	, CONSTRAINT exclude_overlapping_requests EXCLUDE USING gist(int4range(employee_id, employee_id, '[]') WITH =, tsrange(start_datetime, end_datetime) WITH &&) WHERE (active)
	, CONSTRAINT denied_status_implies_not_active CHECK((status_id != 3 AND active = TRUE) OR (status_id = 3 AND active = FALSE))
);
CREATE INDEX request_employee_idx ON request(employee_id);

-- A single discrete unit with a time off request (usually a day or half day)
CREATE TABLE request_unit (
	id SERIAL PRIMARY KEY
	, request_id INTEGER NOT NULL REFERENCES request(id) ON DELETE CASCADE
	, start_datetime TIMESTAMP NOT NULL
	, end_datetime TIMESTAMP NOT NULL
	, CONSTRAINT end_after_start CHECK(end_datetime > start_datetime)
	, CONSTRAINT exclude_overlapping_units EXCLUDE USING gist(int4range(request_id, request_id, '[]') WITH =, tsrange(start_datetime, end_datetime) WITH &&)
);
CREATE INDEX unit_request_idx ON request_unit(request_id);

-- Overlap between different employees' requests
CREATE TABLE collision (
	request_1 INTEGER NOT NULL REFERENCES request(id) ON DELETE CASCADE
	, request_2 INTEGER NOT NULL REFERENCES request(id) ON DELETE CASCADE 
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
	, transaction_datetime TIMESTAMP NOT NULL DEFAULT NOW()
);