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
        for (let request of requestArray) {
            const id = request.batch_of_requests_id;
            const index = await uniqueGroupIDs.indexOf(id);
            if (index < 0) {
                await uniqueGroupIDs.push(id);
                await groupArray.push([]);
                await groupArray[groupArray.length - 1].push(request);
            } else {
                await groupArray[index].push(request);
            }
        }
        return groupArray;
    }

    // Returns an array of unique years for time-off requests
    async getYears() {
        const id = this.config.employee;
        const year = this.config.year;
        console.log(`id = ${id}, year = ${year}`);
        if (id) {
            const selectText = `
            SELECT DISTINCT EXTRACT(YEAR FROM off_date) AS year_part
            FROM time_off_request
            JOIN batch_of_requests ON time_off_request.batch_of_requests_id = batch_of_requests.id
            WHERE batch_of_requests.employee_id = $1
            AND $2::numeric IS NULL OR EXTRACT(YEAR FROM off_date) = $2;
            `;
            const { rows } = await this.client.query(selectText, [id, year]);
            const yearArray = await rows.map(row => row.year_part);
            return yearArray;
        } else {
            const selectText = `
            SELECT DISTINCT EXTRACT(YEAR FROM off_date) AS year_part
            FROM time_off_request;
            `;
            const { rows } = await this.client.query(selectText);
            const yearArray = await rows.map(row => row.year_part);
            return yearArray;
        }
    }

    // Selects all time-off requests restricted by provided WHERE clauses
    async composeJoinRequest(whereClause) {
        const joinText = `
        SELECT
            time_off_request.id,
            time_off_request.off_date AS date,
            time_off_request.off_hours AS hours,
            time_off_request.batch_of_requests_id,
            batch_of_requests.date_requested AS date_requested,
            employee.first_name,
            employee.last_name,
            leave_type.val AS type,
            request_status.val AS status
        FROM employee 
        JOIN batch_of_requests ON employee.id = batch_of_requests.employee_id
        JOIN leave_type ON leave_type.id = batch_of_requests.leave_type_id
        JOIN request_status ON request_status.id = batch_of_requests.request_status_id
        JOIN time_off_request ON batch_of_requests.id = time_off_request.batch_of_requests_id
        ${whereClause}
        ORDER BY date_requested;
        `;
        return joinText;
    }

    // Returns an array of requests that have a given status and year
    async getRequests(status) {
        const year = this.config.year;
        if (year) {
            const whereClause = `
            WHERE request_status.id = $1
            AND EXTRACT(YEAR FROM time_off_request.off_date) = $2
            AND time_off_request.off_date >= (CURRENT_DATE - integer '${GRACE_PERIOD}')
            `;
            const selectText = await this.composeJoinRequest(whereClause);
            const { rows } = await this.client.query(selectText, [status, year]);
            const requests = await this.sortIntoGroups(rows);
            return requests;
        } else {
            const whereClause = `
            WHERE request_status.id = $1
            AND time_off_request.off_date >= (CURRENT_DATE - integer '${GRACE_PERIOD}')
            `;
            const selectText = await this.composeJoinRequest(whereClause);
            const { rows } = await this.client.query(selectText, [status]);
            const requests = await this.sortIntoGroups(rows);
            return requests;
        }
    }

    async getEmployeeRequests(status) {
        // TODO: Can combine this with getRequests();
        const id = this.config.employee;
        const year = this.config.year;
        if (year) {
            const whereClause = `
            WHERE request_status.id = $1
            AND employee.id = $2
            AND EXTRACT(YEAR FROM time_off_request.off_date) = $3
            `;
            const selectText = await this.composeJoinRequest(whereClause);
            const { rows } = await this.client.query(selectText, [status, id, year]);
            const requests = await this.sortIntoGroups(rows);
            return requests;
        } else {
            const whereClause = `
            WHERE request_status.id = $1
            AND employee.id = $2
            AND time_off_request.off_date >= (CURRENT_DATE - integer '${GRACE_PERIOD}')
            `;
            const selectText = await this.composeJoinRequest(whereClause);
            const { rows } = await this.client.query(selectText, [status, id]);
            const requests = await this.sortIntoGroups(rows);
            return requests;
        }
    }

    // Returns an array of all request that are now in the past based on the grace period
    async getPastRequests() {
        // TODO: Can restrict this based on employee_id and combine with getRequests() and getEmployeeRequests()
        const whereClause = `WHERE time_off_request.off_date < (CURRENT_DATE - integer '${GRACE_PERIOD}')`;
        const selectText = await this.composeJoinRequest(whereClause);
        const { rows } = await this.client.query(selectText);
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

    // Returns a batch of requests object based on batch id
    async getBatchData() {
        const id = this.config.batch;
        const selectText = `
        SELECT 
            id,
            employee_id, 
            request_status_id, 
            leave_type_id
        FROM batch_of_requests 
        WHERE id = $1;
        `;
        const { rows } = await this.client.query(selectText, [id]);
        return {
            id: rows[0].id,
            employee: rows[0].employee_id,
            status: rows[0].request_status_id,
            type: rows[0].leave_type_id
        };
    };

    // Changes the status (PENDING, APPROVED, DENIED) of a batch of requests
    async updateBatchStatus(id, status) {
        const updateText = `
        UPDATE batch_of_requests
        SET request_status_id = $1
        WHERE id = $2;
        `;
        await this.client.query(updateText, [status, id]);
    }

    // Refund the total number of off-hours found in a batch of requests
    async refundBatchHours(batch) {
        let hours;
        if (batch.type === VACATION_TYPE) {
            hours = 'vacation_hours';
        } else if (batch.type === SICK_TYPE) {
            hours = 'sick_hours';
        } else {
            throw Error(`Error in request.router.js function refundBatchHours. Invalid batch.type (${batch.type}).`);
        }

        const sumHoursText = `
        SELECT SUM(off_hours)
        FROM time_off_request
        WHERE batch_of_requests_id = $1;
        `;
        const { rows } = await this.client.query(sumHoursText, [batch.id]);
        const refundHours = rows[0].sum;

        const updateEmployeeText = `
        UPDATE employee
        SET ${hours} = ${hours} + $1
        WHERE id = $2
        `;
        await this.client.query(updateEmployeeText, [refundHours, batch.employee]);
    }

    // Deletes a batch of time-off requests
    async deleteBatch(batch) {
        const deleteRequestsText = `
        DELETE FROM time_off_request
        WHERE batch_of_requests_id = $1;
        `;
        await this.client.query(deleteRequestsText, [batch.id]);
        const deleteBatchText = `
        DELETE FROM batch_of_requests
        WHERE id = $1;
        `;
        await this.client.query(deleteBatchText, [batch.id]);
    }
}

module.exports = RequestClient;