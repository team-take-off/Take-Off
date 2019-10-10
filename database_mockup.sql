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

INSERT INTO time_off_request
    (employee_id, leave_type_id, request_status_id, active, start_datetime, end_datetime)
VALUES
    (1, 1, 1, 1, '2019-10-22 09:00 AM', '2019-10-24 01:00 PM'),
    (2, 2, 1, 1, '2019-10-22 01:00 PM', '2019-10-24 05:00 PM'),
    (2, 2, 3, 0, '2019-10-22 01:00 PM', '2019-10-24 05:00 PM'),
    (5, 1, 1, 1, '2019-10-28 09:00 AM', '2019-10-28 05:00 PM');

INSERT INTO request_unit
    (time_off_request_id, start_datetime, end_datetime)
VALUES
    (1, '2019-10-22 09:00 AM', '2019-10-22 05:00 PM'),
    (1, '2019-10-23 09:00 AM', '2019-10-23 05:00 PM'),
    (1, '2019-10-24 09:00 AM', '2019-10-24 01:00 PM'),
    (2, '2019-10-22 01:00 PM', '2019-10-22 05:00 PM'),
    (2, '2019-10-23 09:00 AM', '2019-10-23 05:00 PM'),
    (2, '2019-10-24 09:00 AM', '2019-10-24 05:00 PM'),
    (3, '2019-10-22 01:00 PM', '2019-10-22 05:00 PM'),
    (3, '2019-10-23 09:00 AM', '2019-10-23 05:00 PM'),
    (3, '2019-10-24 09:00 AM', '2019-10-24 05:00 PM'),
    (4, '2019-10-28 09:00 AM', '2019-10-28 05:00 PM');

INSERT INTO collision
    (request_1, request_2)
VALUES
    (1, 2);