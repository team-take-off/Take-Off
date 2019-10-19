const Collision = require('./Collision');
const Request = require('./Request');
const RequestStatus = require('./RequestStatus');
const RequestType = require('./RequestType');
const TransactionCodes = require('../constants/TransactionCodes');

const GRACE_PERIOD = 5;

class RequestClient {
    constructor(pool, config) {
        this.pool = pool;
        this.config = config;
        this.client;
    }

    async connect() {
        this.client = await this.pool.connect();
    }

    async query(queryText, queryParams) {
        return await this.client.query(queryText, queryParams); 
    }

    async begin() {
        await this.client.query('BEGIN');
    }

    async commit() {
        await this.client.query('COMMIT');
    }

    async rollback() {
        await this.client.query('ROLLBACK');
    }

    release() {
        this.client.release();
    }

    // Returns an array of unique years for time-off requests
    async getYears() {
        const id = this.config.employee;
        const selectText = `
        SELECT DISTINCT EXTRACT(YEAR FROM request_unit.start_datetime) AS year_part
        FROM request
        JOIN request_unit ON request.id = request_unit.request_id
            WHERE $1::numeric IS NULL OR request.employee_id = $1;
        `;
        const { rows } = await this.client.query(selectText, [id]);
        const yearArray = await rows.map(row => row.year_part);
        return yearArray;
    }

    // Returns an array of unique years for time-off requests that meet optional
    // filter criteria
    async getYearsFilter(employee, leave, status) {        
        const selectText = `
        SELECT DISTINCT EXTRACT(YEAR FROM request_unit.start_datetime) AS extract_year
        FROM request
        JOIN request_unit ON request.id = request_unit.request_id
            WHERE ($1::numeric IS NULL OR request.employee_id = $1)
            AND ($2::numeric IS NULL OR request.leave_type_id = $2)
            AND ($3::numeric IS NULL OR request.status_id = $3)
        ORDER BY extract_year ASC;
        `;
        const { rows } = await this.client.query(selectText, [employee, leave, status]);
        return rows.map(row => row.extract_year);
    }

    // Selects all time-off requests restricted by provided WHERE clauses
    async composeJoinRequest(whereClause) {
        const joinText = `
        SELECT
            request.id AS id,
            DATE(request_unit.start_datetime) AS date,
            request_unit.start_datetime AS unit_start_date,
            request_unit.end_datetime AS unit_end_date,
            EXTRACT(HOUR FROM request_unit.start_datetime) = 9 AND EXTRACT(HOUR FROM request_unit.end_datetime) = 17 AS is_fullday,
            EXTRACT(HOUR FROM request_unit.start_datetime) = 9 AND EXTRACT(HOUR FROM request_unit.end_datetime) = 13 AS is_morning,
            EXTRACT(HOUR FROM request_unit.start_datetime) = 13 AND EXTRACT(HOUR FROM request_unit.end_datetime) = 17 AS is_afternoon,
            request_unit.request_id,
            request.start_datetime AS start_date,
            request.end_datetime AS end_date,
            request.placed_datetime AS date_requested,
            employee.id AS employee_id,
            employee.first_name,
            employee.last_name,
            leave_type.val AS type,
            request.leave_type_id AS type_id,
            request_status.val AS status,
            request.status_id
        FROM employee 
        JOIN request ON employee.id = request.employee_id
        JOIN leave_type ON leave_type.id = request.leave_type_id
        JOIN request_status ON request_status.id = request.status_id
        JOIN request_unit ON request.id = request_unit.request_id
        ${whereClause}
        ORDER BY date_requested;
        `;
        return joinText;
    }

    // Returns an array of requests that have a given status and year
    async getRequests(status) {
        const id = this.config.employee;
        const year = this.config.year;
        const whereClause = `
        WHERE request_status.id = $1
        AND ($2::numeric IS NULL OR request.employee_id = $2)
        AND ($3::numeric IS NULL OR EXTRACT(YEAR FROM request_unit.start_datetime) = $3)
        AND request.end_datetime >= (CURRENT_DATE - integer '${GRACE_PERIOD}')
        `;
        const selectText = await this.composeJoinRequest(whereClause);
        const { rows } = await this.client.query(selectText, [status, id, year]);
        const requests = Request.loadQuery(rows);

        for (let request of requests) {
            if (request.status !== 'denied') {
                const collisionRows = await this.getCollisions(request.id);
                const collisions = Collision.loadQuery(collisionRows);
                request.collisions = collisions;
            }
        }
        return requests;
    }

    async getCollisions(unit_id) {
        const selectCollisions = `
        SELECT
            request.id AS id,
            employee.id AS employee_id,
            employee.first_name,
            employee.last_name,
            leave_type.val AS type,
            request_status.val AS status,
            request.status_id,
            request.start_datetime AS start_date,
            request.end_datetime AS end_date,
            request.placed_datetime AS date_requested
        FROM employee 
        JOIN request ON employee.id = request.employee_id
        JOIN leave_type ON leave_type.id = request.leave_type_id
        JOIN request_status ON request_status.id = request.status_id
        JOIN collision ON collision.request_1 = request.id
        WHERE collision.request_2 = $1 AND request.active
        UNION
        SELECT
            request.id AS id,
            employee.id AS employee_id,
            employee.first_name,
            employee.last_name,
            leave_type.val AS type,
            request_status.val AS status,
            request.status_id,
            request.start_datetime AS start_date,
            request.end_datetime AS end_date,
            request.placed_datetime AS date_requested
        FROM employee 
        JOIN request ON employee.id = request.employee_id
        JOIN leave_type ON leave_type.id = request.leave_type_id
        JOIN request_status ON request_status.id = request.status_id
        JOIN collision ON collision.request_2 = request.id
        WHERE collision.request_1 = $1 AND request.active
        ORDER BY date_requested;
        `;
        const { rows } = await this.client.query(selectCollisions, [unit_id]);
        return rows;
    }

    // Returns an array of all request that are now in the past based on the grace period
    async getPastRequests() {
        const id = this.config.employee;
        const year = this.config.year;
        const whereClause = `
        WHERE ($1::numeric IS NULL OR request.employee_id = $1)
        AND ($2::numeric IS NULL OR EXTRACT(YEAR FROM request_unit.start_datetime) = $2)
        AND request.end_datetime < (CURRENT_DATE - integer '${GRACE_PERIOD}')
        `;
        const selectText = await this.composeJoinRequest(whereClause);
        const { rows } = await this.client.query(selectText, [id, year]);
        const requests = await Request.loadQuery(rows);
        return requests;
    }

    // Select total available hours of given type (e.g. vacation or sick) for current employee
    async getTotalHours() {
        const userID = this.config.employee;
        const typeHoursName = (new RequestType(this.config.type)).columnName;

        const selectText = `
        SELECT ${typeHoursName} AS hours
        FROM employee
        WHERE id = $1;
        `;
        const { rows } = await this.client.query(selectText, [userID]);
        const hours = rows[0].hours;
        return hours;
    }

    // Insert a new request and return the assigned id (i.e. the primary key)
    async insertRequest(request, specialEdit) {
        const employeeID = request.employee.id;
        const leaveTypeID = request.type.lookup;
        const statusID = request.status.lookup;
        const startDate = request.startDate;
        const endDate = request.endDate;
        const active = statusID !== RequestStatus.code.DENIED;

        const insertText = `
        INSERT INTO request
        (employee_id, leave_type_id, status_id, active, start_datetime, end_datetime)
        VALUES
        ($1, $2, $3, $4, $5, $6)
        RETURNING id;
        `;
        const { rows } = await this.client.query(insertText, [employeeID, leaveTypeID, statusID, active, startDate, endDate]);
        const requestID = rows[0].id;

        for (let unit of request.units) {
            await this.insertRequestUnit(unit, requestID, employeeID, request.type.columnName, specialEdit);
        }

        const insertCollisionsText = `
        INSERT INTO collision
        (request_1, request_2)
            SELECT id AS request_1, $1 AS request_2
            FROM request
            WHERE id != $1
            AND (
                start_datetime <= $2 AND end_datetime >= $2
                OR start_datetime <= $3 AND end_datetime >= $3
                OR $2 <= start_datetime AND $3 >= start_datetime
            );
        `;
        await this.client.query(insertCollisionsText, [requestID, startDate, endDate]);
    };

    // Insert a new requested day for time-off. Then update the employee's total
    // hours available.
    async insertRequestUnit(unit, requestID, employeeID, hoursColumnName, specialEdit) {        
        const selectConflicting = `
        SELECT request_unit.id
        FROM request_unit
        JOIN request ON request_unit.request_id = request.id
        WHERE request.employee_id = $1
        AND active
        AND (
            request_unit.start_datetime <= $2 AND request_unit.end_datetime >= $2
            OR request_unit.start_datetime <= $3 AND request_unit.end_datetime >= $3
            OR $2 <= request_unit.start_datetime AND $3 >= request_unit.start_datetime
        )
        LIMIT 1;
        `;
        const { rows } = await this.client.query(selectConflicting, [employeeID, unit.startDate.format(), unit.endDate.format()]);
        if (rows.length > 0) {
            throw Error(`Error in RequestClient.js function insertRequestUnit. Conflicting entries found.`);
        }

        const insertUnitText = `
        INSERT INTO request_unit
        (request_id, start_datetime, end_datetime)
        VALUES
        ($1, $2, $3)
        RETURNING id;
        `;
        await this.client.query(insertUnitText, [requestID, unit.startDate.format(), unit.endDate.format()]);

        if (!specialEdit) {
            const updateHours = `
            UPDATE employee SET 
            ${hoursColumnName} = ${hoursColumnName} - $1
            WHERE id = $2;
            `;
            await this.client.query(updateHours, [unit.hours, employeeID]);
        }
    }

    // Returns summary data on a request based on id
    async getRequestData(id) {
        const selectText = `
        SELECT 
            request.id,
            employee_id, 
            status_id,
            leave_type_id,
            SUM(EXTRACT(HOURS FROM request_unit.end_datetime - request_unit.start_datetime)) AS hours,
            request.end_datetime >= (CURRENT_DATE - integer '${GRACE_PERIOD}') AS in_future
        FROM request
        JOIN request_unit ON request.id = request_unit.request_id
        WHERE request.id = $1
        GROUP BY request.id
        LIMIT 1;
        `;
        const { rows } = await this.client.query(selectText, [id]);
        return {
            id: rows[0].id,
            employee: rows[0].employee_id,
            status: rows[0].status_id,
            type: rows[0].leave_type_id,
            hours: rows[0].hours,
            in_future: rows[0].in_future
        };
    };

    // Changes the status (PENDING, APPROVED, DENIED) of a time-off request
    async updateStatus(id, status) {
        const status_id = status.lookup;
        const active = status_id !== RequestStatus.code.DENIED;
        const updateText = `
        UPDATE request
        SET status_id = $1, active = $2
        WHERE id = $3;
        `;
        await this.client.query(updateText, [status_id, active, id]);
    }

    // Delete all entries in collisions table with a given request ID
    async removeCollisions(id) {
        const deleteText = `
        DELETE FROM collision 
        WHERE request_1 = $1 OR request_2 = $1;
        `;
        await this.client.query(deleteText, [id]);
    }

    // Deletes a time-off request
    async deleteRequest(request, user, transactionCode) {
        const deleteRequest = `
        DELETE FROM request
        WHERE id = $1;
        `;
        await this.client.query(deleteRequest, [request.id]);
        if (request.status !== RequestStatus.code.DENIED && transactionCode !== TransactionCodes.ADMIN_SPECIAL) {
            await this.refundHours(request, user, transactionCode);
        }
    }

    // Refund the total number of off-hours found in a batch of requests
    async refundHours(request, user, transactionCode) {
        const hoursColumn = RequestType.columnName(request.type);
        const updateEmployee = `
        UPDATE employee
        SET ${hoursColumn} = ${hoursColumn} + $1
        WHERE id = $2
        `;
        await this.client.query(updateEmployee, [request.hours, request.employee]);
        const logUpdate = `
        INSERT INTO transaction_log
            (author_id, employee_id, leave_hours, leave_type_id, transaction_type_id)
        VALUES
            ($1, $2, $3, $4, $5);
        `;
        await this.client.query(logUpdate, [user.id, request.employee, request.hours, request.type, transactionCode]);
    }
}

module.exports = RequestClient;