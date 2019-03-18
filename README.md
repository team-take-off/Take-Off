# Take-Off
This web application was built to manage requests for off days (vacation and sick leave) for the Legal Rights Center in Minneapolis, MN. Users can login and and are authenticated at employee-level or administrator-level. Employees can make requests for off days and then view the status of those requests. Administrators can view the requests of all users and accept or deny requests. The status of a given request (pending, approved, denied) is then communicated back to the employee.

## Utilized Web Stack
- `User Interface` - React, CSS, react-big-callendar, Material.ui, Sweetalert
- `Client` - React, Redux, Redux-Saga, Axios, Passport
- `Server` - Node.js, Express, Node-Cron
- `Database` - PostgreSQL

## Requirements
- Git
- Web browser
- Node and npm
- PostgreSQL

## Setup and Run
```bash
# 1. Create PostgreSQL database named 'take_off'
createdb take_off

# 2. Create database tables using SQL create statements in 'database.sql'. 
# (Optional: initalize database with sample data also found in 'database.sql')

# 3. Install Node dependencies/libraries using NPM
npm install

# 4. Start the server
npm run server

# 5. Start the client
npm run client

# 6. Application runs locally on PORT 3000
```

**See:** [localhost:3000](http://localhost:3000)

## Features

### Completed Features
- [x] Login with local authentication

### Future Features

## Deployment
In the future this project will be deployed to Heroku

## Authors
- Bode Falade
- Sharmarke Duale
- Max Todd
- Mike Stockman

## Acknowledgements
- We would like to thank Michael Friedman and the rest of the Legal Rights Center
- We would like to thank our instructors Chris Black, Kris Szfranski and Ally Boyd, and Dane Smith
- Thanks to our Prime Digital Academy cohort Zaurak