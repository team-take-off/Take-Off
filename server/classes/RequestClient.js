const GRACE_PERIOD = 5;

const VACATION_TYPE = 1;
const SICK_TYPE = 2;

const SUNDAY = '0';
const SATURDAY = '6';

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

    // Sort an array of requests into an array of arrays (grouped by batch ID)
    async sortIntoGroups(requestArray) {
        const uniqueGroupIDs = [];
        const groupArray = [];
        for (let requestUnit of requestArray) {
            const id = requestUnit.time_off_request_id;
            const index = await uniqueGroupIDs.indexOf(id);
            if (index < 0) {
                await uniqueGroupIDs.push(id);
                await groupArray.push([]);
                await groupArray[groupArray.length - 1].push(requestUnit);
            } else {
                await groupArray[index].push(requestUnit);
            }
        }
        return groupArray;
    }

    // Returns an array of unique years for time-off requests
    async getYears() {
        const id = this.config.employee;
        const selectText = `
        SELECT DISTINCT EXTRACT(YEAR FROM request_unit.start_datetime) AS year_part
        FROM time_off_request
        JOIN request_unit ON time_off_request.id = request_unit.time_off_request_id
            WHERE $1::numeric IS NULL OR time_off_request.employee_id = $1;
        `;
        const { rows } = await this.client.query(selectText, [id]);
        const yearArray = await rows.map(row => row.year_part);
        return yearArray;
    }

    // Selects all time-off requests restricted by provided WHERE clauses
    async composeJoinRequest(whereClause) {
        const joinText = `
        SELECT
            time_off_request.id AS id,
            request_unit.id AS request_unit_id,
            DATE(request_unit.start_datetime) AS date,
            EXTRACT(HOUR FROM request_unit.start_datetime) = 9 AND EXTRACT(HOUR FROM request_unit.end_datetime) = 17 AS is_fullday,
            EXTRACT(HOUR FROM request_unit.start_datetime) = 9 AND EXTRACT(HOUR FROM request_unit.end_datetime) = 13 AS is_morning,
            EXTRACT(HOUR FROM request_unit.start_datetime) = 13 AND EXTRACT(HOUR FROM request_unit.end_datetime) = 17 AS is_afternoon,
            request_unit.time_off_request_id,
            time_off_request.placed_datetime AS date_requested,
            employee.id AS employee_id,
            employee.first_name,
            employee.last_name,
            leave_type.val AS type,
            request_status.val AS status
        FROM employee 
        JOIN time_off_request ON employee.id = time_off_request.employee_id
        JOIN leave_type ON leave_type.id = time_off_request.leave_type_id
        JOIN request_status ON request_status.id = time_off_request.request_status_id
        JOIN request_unit ON time_off_request.id = request_unit.time_off_request_id
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
        AND ($2::numeric IS NULL OR time_off_request.employee_id = $2)
        AND ($3::numeric IS NULL OR EXTRACT(YEAR FROM request_unit.start_datetime) = $3)
        AND time_off_request.end_datetime <= (CURRENT_DATE + integer '${GRACE_PERIOD}')
        `;
        const selectText = await this.composeJoinRequest(whereClause);
        const { rows } = await this.client.query(selectText, [status, id, year]);
        const requests = await this.sortIntoGroups(rows);
        return requests;
    }

    // Returns an array of all request that are now in the past based on the grace period
    async getPastRequests() {
        const id = this.config.employee;
        const year = this.config.year;
        const whereClause = `
        WHERE ($1::numeric IS NULL OR time_off_request.employee_id = $1)
        AND ($2::numeric IS NULL OR EXTRACT(YEAR FROM request_unit.start_datetime) = $2)
        AND time_off_request.end_datetime > (CURRENT_DATE + integer '${GRACE_PERIOD}')
        `;
        const selectText = await this.composeJoinRequest(whereClause);
        const { rows } = await this.client.query(selectText, [id, year]);
        const requests = await this.sortIntoGroups(rows);
        return requests;
    }

    // Insert a new batch of requests and return the assigned id (i.e. the primary key)
    async insertBatch(typeID) {
        const userID = this.config.employee;
        const insertText = `
        INSERT INTO batch_of_requests
        (employee_id, leave_type_id)
        VALUES
        ($1, $2)
        RETURNING id;
        `;
        const { rows } = await this.client.query(insertText, [userID, typeID]);
        const batchID = rows[0].id;
        return batchID;
    };

    // Insert a new request for time-off. Then update the employee's total hours 
    // available.
    async insertRequest(request, userID, batchID, typeID) {
        let hours;
        if (typeID === VACATION_TYPE) {
            hours = 'vacation_hours';
        } else if (typeID === SICK_TYPE) {
            hours = 'sick_hours';
        } else {
            throw Error(`Error in request.router.js function insertRequest. Invalid typeID (${typeID}) must be 1 or 2.`);
        }

        const date = moment(request.date, 'YYYY-MM-DD');
        const day = date.format('d');
        if (day !== SUNDAY && day !== SATURDAY) {
            const insertRequest = `
            INSERT INTO time_off_request
            (off_date, batch_of_requests_id, off_hours)
            VALUES
            ($1, $2, $3);
            `;
            await this.client.query(insertRequest, [request.date, batchID, request.hours]);
            const updateHours = `
            UPDATE employee SET 
            ${hours} = ${hours} - $1
            WHERE id = $2;
            `;
            await this.client.query(updateHours, [request.hours, userID]);
        }
    }

    // Returns summary data on a request based on id
    async getRequestData(id) {
        const selectText = `
        SELECT 
            time_off_request.id,
            employee_id, 
            request_status_id,
            leave_type_id,
            SUM(EXTRACT(HOURS FROM request_unit.end_datetime - request_unit.start_datetime)) AS hours,
            time_off_request.end_datetime <= (CURRENT_DATE + integer '${GRACE_PERIOD}') AS in_future
        FROM time_off_request
        JOIN request_unit ON time_off_request.id = request_unit.time_off_request_id
        WHERE time_off_request.id = $1
        GROUP BY time_off_request.id
        LIMIT 1;
        `;
        const { rows } = await this.client.query(selectText, [id]);
        return {
            id: rows[0].id,
            employee: rows[0].employee_id,
            status: rows[0].request_status_id,
            type: rows[0].leave_type_id,
            hours: rows[0].hours
        };
    };

    // Changes the status (PENDING, APPROVED, DENIED) of a time-off request
    async updateStatus(id, status) {
        const updateText = `
        UPDATE time_off_request
        SET request_status_id = $1
        , active = (SELECT active FROM request_status WHERE id = $1)
        WHERE id = $2;
        `;
        await this.client.query(updateText, [status, id]);
    }

    // Refund the total number of off-hours found in a batch of requests
    async refundHours(request, userID, transactionType) {
        let hours_column;
        if (request.type === VACATION_TYPE) {
            hours_column = 'vacation_hours';
        } else if (batch.type === SICK_TYPE) {
            hours_column = 'sick_hours';
        } else {
            throw Error(`Error in request.router.js function refundBatchHours. Invalid request.type (${request.type}).`);
        }

        const updateEmployee = `
        UPDATE employee
        SET ${hours_column} = ${hours_column} + $1
        WHERE id = $2
        `;
        await this.client.query(updateEmployee, [request.hours, request.employee]);
        const logUpdate = `
        INSERT INTO transaction_log
            (author_id, employee_id, leave_hours, leave_type_id, transaction_type_id)
        VALUES
            ($1, $2, $3, $4, $5);
        `;
        await this.client.query(logUpdate, [userID, request.employee, request.hours, request.type, transactionType]);
    }

    // Deletes a time-off request
    async deleteRequest(request, userID, transactionType) {
        const deleteRequest = `
        DELETE FROM time_off_request
        WHERE id = $1;
        `;
        await this.client.query(deleteRequest, [request.id]);
        if (request.status === 1 || request.status === 2) {
            await this.refundHours(request, userID, transactionType);
        }
    }
}

module.exports = RequestClient;