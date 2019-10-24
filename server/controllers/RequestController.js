const moment = require('moment');

const Collision = require('../classes/Collision');
const Request = require('../classes/Request');
const RequestStatus = require('../classes/RequestStatus');
const RequestType = require('../classes/RequestType');

const GRACE_PERIOD = 5;

const MOMENT_DB_FORMAT = 'YYYY-MM-DD HH:mm:ss';

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

    // Returns an array of unique years for time-off requests that meet optional
    // filter criteria
    async getYears(employee, status, leave) {        
        const selectText = `
        SELECT DISTINCT EXTRACT(YEAR FROM request_unit.start_datetime) AS extract_year
        FROM request
        JOIN request_unit ON request.id = request_unit.request_id
            WHERE ($1::numeric IS NULL OR request.employee_id = $1)
            AND ($2::numeric IS NULL OR request.status_id = $2)
            AND ($3::numeric IS NULL OR request.leave_type_id = $3)
        ORDER BY extract_year ASC;
        `;
        const { rows } = await this.client.query(selectText, [employee, status, leave]);
        return rows.map(row => row.extract_year);
    }

    // Returns the number of time-off requests that satisfy all of the optional 
    // filter criteria
    async getCount(employee, status, leave, startDate, endDate) {
        const active = status !== RequestStatus.DENIED ? true : false;
        let queryParams = [active, employee, status, leave];

        let dateClause = `request.end_datetime >= (CURRENT_DATE - integer '${GRACE_PERIOD}')`;
        if (startDate || endDate) {
            dateClause = `(($5::timestamp IS NULL OR start_datetime <= $5) AND ($6::timestamp IS NULL OR end_datetime >= $6))`;
            queryParams = [...queryParams, startDate, endDate];
        }

        const selectText = `
        SELECT COUNT(id) AS count
        FROM request
            WHERE (active = $1)
            AND ($2::numeric IS NULL OR employee_id = $2)
            AND ($3::numeric IS NULL OR status_id = $3)
            AND ($4::numeric IS NULL OR leave_type_id = $4)
            AND ${dateClause};
        `;
        const { rows } = await this.client.query(selectText, queryParams);
        return rows[0].count;
    }

    // Filter range defaults to +/- one year from current year. If a year is 
    // provided it filters from the start of that year to the end.
    static getFilterStartDate(year) {
        if (year) {
            return moment(year, 'YYYY').startOf('year');
        } else {
            const currentYear = moment().year();
            return moment(currentYear, 'YYYY').subtract(1, 'years').startOf('year');
        }
    }

    // Filter range defaults to +/- one year from current year. If a year is 
    // provided it filters from the start of that year to the end.
    static getFilterEndDate(year) {
        if (year) {
            return moment(year, 'YYYY').endOf('year');
        } else {
            const currentYear = moment().year();
            return moment(currentYear, 'YYYY').add(1, 'years').endOf('year');
        }
    }

    // Returns an array of requests that have a given status and year
    async getRequests(employee, year, leave, status, past) {
        let dateClause = `request.end_datetime >= (CURRENT_DATE - integer '${GRACE_PERIOD}')`;
        if (past) {
            dateClause = `request.end_datetime < (CURRENT_DATE - integer '${GRACE_PERIOD}')`;
        }

        const whereClause = `
        WHERE request.status_id = $1
        AND ($2::numeric IS NULL OR request.employee_id = $2)
        AND ($3::numeric IS NULL OR EXTRACT(YEAR FROM request_unit.start_datetime) = $3)
        AND ${dateClause}
        `;

        const selectText = `
        SELECT
            request.id AS id,
            request.leave_type_id AS type,
            request.status_id AS status,
            request.start_datetime AS start_date,
            request.end_datetime AS end_date,
            employee.id AS employee_id,
            employee.first_name,
            employee.last_name,
            request_unit.start_datetime AS unit_start_date,
            request_unit.end_datetime AS unit_end_date
        FROM request
        JOIN employee ON employee.id = request.employee_id
        JOIN request_unit ON request.id = request_unit.request_id
        ${whereClause}
        ORDER BY request.start_datetime ASC;
        `;

        const { rows } = await this.client.query(selectText, [status, employee, year]);
        const requests = Request.loadQuery(rows);

        for (let request of requests) {
            if (request.status !== RequestStatus.DENIED) {
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
            request.leave_type_id AS type,
            request.status_id,
            request.status_id AS status,
            request.start_datetime AS start_date,
            request.end_datetime AS end_date,
            request.placed_datetime,
            employee.id AS employee_id,
            employee.first_name,
            employee.last_name
        FROM employee 
        JOIN request ON employee.id = request.employee_id
        JOIN collision ON collision.request_1 = request.id
        WHERE collision.request_2 = $1 AND request.active
        UNION
        SELECT
            request.id AS id,
            request.leave_type_id AS type,
            request.status_id,
            request.status_id AS status,
            request.start_datetime AS start_date,
            request.end_datetime AS end_date,
            request.placed_datetime,
            employee.id AS employee_id,
            employee.first_name,
            employee.last_name
        FROM employee 
        JOIN request ON employee.id = request.employee_id
        JOIN collision ON collision.request_2 = request.id
        WHERE collision.request_1 = $1 AND request.active
        ORDER BY placed_datetime;
        `;
        const { rows } = await this.client.query(selectCollisions, [unit_id]);
        return rows;
    }

    // Select total available hours of given type (e.g. vacation or sick) for current employee
    async getTotalHours() {
        const userID = this.config.employee;
        const typeHoursName = RequestType.columnName(this.config.type);

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
    async deleteRequest(request, refund) {
        const deleteRequest = `
        DELETE FROM request
        WHERE id = $1;
        `;
        await this.client.query(deleteRequest, [request.id]);

        if (refund && request.status !== RequestStatus.code.DENIED) {
            await this.refundHours(request);
        }
    }

    // Refund the total number of off-hours found in a batch of requests
    async refundHours(request) {
        const hoursColumn = RequestType.columnName(request.type);
        const updateEmployee = `
        UPDATE employee
        SET ${hoursColumn} = ${hoursColumn} + $1
        WHERE id = $2
        `;
        await this.client.query(updateEmployee, [request.hours, request.employee]);
    }
}

module.exports = RequestClient;