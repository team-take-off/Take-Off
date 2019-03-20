import React, {Component} from 'react';
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import {connect} from 'react-redux';

import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'

import AdminAddEmployeePage from '../AdminAddEmployeePage/AdminAddEmployeePage';
import AdminEditEmployeePage from '../AdminEditEmployeePage/AdminEditEmployeePage';
import AdminCalendarPage from '../AdminCalendarPage/AdminCalendarPage';
import AdminEmployeeListPage from '../AdminEmployeeListPage/AdminEmployeeListPage';
import AdminSearchEmployeePage from '../AdminSearchEmployeePage/AdminSearchEmployeePage';
import AdminHomePage from '../AdminHomePage/AdminHomePage';
import EmployeeHomePage from '../EmployeeHomePage/EmployeeHomePage';
import EmployeeRequestsPage from '../EmployeeRequestsPage/EmployeeRequestsPage';
import EmployeeCalendarPage from '../EmployeeCalendarPage/EmployeeCalendarPage';
import SickRequestPage from '../SickRequestPage/SickRequestPage';
import VacationRequestPage from '../VacationRequestPage/VacationRequestPage';

import './App.css';

class App extends Component {
  componentDidMount () {
    this.props.dispatch({type: 'FETCH_USER'})
  }

  render() {
    return (
      <Router>
        <div>
          <Nav />
          <Switch>
            {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
            <Redirect exact from="/" to="/home" />
            
            {/* Visiting localhost:3000/about will show the about page.
            This is a route anyone can see, no login necessary */}
            {/* <Route exact path="/about"
              component={AboutPage}
            /> */}
            {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/home will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the 'Login' or 'Register' page.
            Even though it seems like they are different pages, the user is always on localhost:3000/home */}
            <ProtectedRoute exact path="/home"
              component={EmployeeHomePage}
            />
            <ProtectedRoute exact path="/employee_requests"
              component={EmployeeRequestsPage}
            />
            <ProtectedRoute exact path="/employee_calendar"
              component={EmployeeCalendarPage}
            />
            <ProtectedRoute exact path="/request_vacation"
              component={VacationRequestPage}
            />
            <ProtectedRoute exact path="/request_sick"
              component={SickRequestPage}
            />
            <ProtectedRoute exact path="/admin/home" 
              component={AdminHomePage}
            />
            <ProtectedRoute exact path="/admin/calendar"
              component={AdminCalendarPage}
            />
            <ProtectedRoute exact path="/admin/search_employee"
              component={AdminSearchEmployeePage}
            />
            <ProtectedRoute exact path="/admin/list_employees"
              component={AdminEmployeeListPage}
            />
            <ProtectedRoute exact path="/admin/add_employee"
              component={AdminAddEmployeePage}
            />
            <ProtectedRoute exact path="/admin/edit_employee/:id"
              component={AdminEditEmployeePage}
            />
            {/* This works the same as the other protected route, except that if the user is logged in,
            they will see the info page instead. */}
            {/* <ProtectedRoute exact path="/info"
              component={InfoPage}
            /> */}
            {/* If none of the other routes matched, we will show a 404. */}
            {/* <Route render={() => <h1>404</h1>} /> */}
          </Switch>
          <Footer />
        </div>
      </Router>
  )}
}

export default connect()(App);
