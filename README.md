# Take-Off
This web application was built to manage requests for off days (vacation and sick leave) for the [Legal Rights Center](https://www.legalrightscenter.org) in Minneapolis, Minnesota.

Users can login and and are authenticated at employee-level or administrator-level. Employees can make requests for off days and then view the status of those requests. Administrators can view the requests of all users and accept or deny requests. The status of a given request (pending, approved, denied) is then communicated back to the employee.

A calendar view available to employees and administrators shows all active requests to help users visualize and plan. 

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
psql -E -f database.sql -d take_off

# Optional: initalize database with sample data found in 'sample.sql'.
psql -E -f sample.sql -d take_off

# 3. Install Node dependencies/libraries using NPM
npm install

# 4. Start the server
npm run server

# 5. Start the client
npm run client

# 6. Application runs locally on PORT 3000
```

**See:** [localhost:3000](http://localhost:3000)

```bash
# 7. Configure your .env file with the following environment variables.
# Note: Do not put your .env file into version control. It will contain sensitive secret information

SERVER_SESSION_SECRET= # A Random String
CLIENT_ID= # Your Google Authentication Client ID
CLIENT_SECRET= # Your Google Authentication Client Secret
CALLBACK_URL=http://localhost:5000/api/user/auth/google/callback
SUCCESS_REDIRECT=http://localhost:3000/#/home
FAIL_REDIRECT=http://localhost:3000/#/login

```

## Features

### Completed Features
- [x] Login with the Passport Google authentication strategy
- [x] Employees can add requests for days off and administrators can view all requests
- [x] Administrators can approve or deny an employee's requests
- [x] Employees can cancel/withdraw requests if the requested dates are still in the future
- [x] Requests are filter and sorted depending on user selections and page context to generally place the most relevant requests forward 
- [x] Administrators can register new user accounts and edit the account data for existing users
- [x] Calendar views display all active requests to help employees and administrators plan time off

### Future Features
- [ ] Detect collisions between requested dates and all other requested dates
- [ ] Add accrued employee vacation and sick time throughout the year with Node-cron tasks
- [ ] Allow more flexible back and forth between employees and administrators such as an in-app way for employees the request retroactive changes to their requests 
- [ ] Add employee images to their request cards from their Google accounts
- [ ] Improve UX particularly with regard to request card buttons. These cards currently have somewhat flat and non-descript buttons. The buttons would ideally float right, include icons, and have colors suggestive of their functions.

## Deploy to Heroku
```bash
# 1. Create a Heroku project
heroku create <remote_project_name>

# 2. Activate the PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# 3. Copy local database "take_off" to Heroku
heroku pg:push take_off DATABASE_URL

# 4. Setup server-side environment variables see section on setting up .env above. Add these environment variabes using the Heroku project web dashboard.
```

## Authors
- Bode Falade
- Sharmarke Duale
- Max Todd
- Mike Stockman
- Eli Friedman

## Acknowledgements
- We would like to thank Michael Friedman and the rest of the Legal Rights Center
- We would like to thank our instructors Chris Black, Kris Szfranski, Ally Boyd, and Dane Smith
- Thanks to our Prime Digital Academy cohort Zaurak