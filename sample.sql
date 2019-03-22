INSERT INTO employee
    (email, first_name, last_name, sick_hours, vacation_hours, role_id, started_date, is_active)
VALUES
    ('Michael@example.com', 'Michael', 'One', 96, 80, 1, '2010-06-23', true),
    ('ElleAkhtar@example.com', 'Elle', 'Akhtar', 96, 80, 2, '2012-08-01', true),
    ('CharlesBowen@example.com', 'Charles', 'Bowen', 96, 76, 2, '2016-03-11', false),
    ('KateyBradshaw@example.com', 'Katey', 'Bradshaw', 92, 76, 2, '2017-10-18', true),
    ('TravisMcDowell@example.com', 'Travis', 'McDowell', 88, 72, 2, '2013-05-24', true),
    ('FridaBonilla@example.com', 'Frida', 'Bonilla', 84, 72, 2, '2013-02-01', false),
    ('BiankaChang@example.com', 'Bianka', 'Chang', 80, 72, 2, '2008-08-08', true);

INSERT INTO accrued_time
    (date_accrued, sick_hours, vacation_hours, employee_id)
VALUES
    ('2019-01-01', 80, 45, 1),
    ('2019-01-01', 80, 50, 2),
    ('2019-01-01', 80, 55, 3),
    ('2019-01-01', 80, 68, 4),
    ('2019-01-01', 80, 61, 5),
    ('2019-01-01', 80, 54, 6),
    ('2019-01-01', 80, 62, 7);

INSERT INTO batch_of_requests
    (employee_id, date_requested, leave_type_id, request_status_id)
VALUES
    (1, '2019-03-11', 2, 1),
    (2, '2019-03-09', 1, 1),
    (3, '2019-02-11', 1, 1),
    (5, '2019-03-07', 1, 3),
    (1, '2019-03-10', 2, 2),
    (2, '2019-03-05', 1, 2);

INSERT INTO time_off_request
    (off_date, batch_of_requests_id, off_hours)
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