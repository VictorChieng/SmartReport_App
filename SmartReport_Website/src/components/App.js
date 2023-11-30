import React from "react"
import UserManagement from "./UserManagement"
import Signup from "./Signup"
import { Container } from "react-bootstrap"
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Login from "./Login"
import PrivateRoute from "./PrivateRoute"
import ForgotPassword from "./ForgotPassword"
import UpdateProfile from "./UpdateProfile"
import AdminDashboard from "./AdminDashboard";
import ManagerDashboard from "./ManagerDashboard";
import AgentDashboard from "./AgentDashboard";
import ReportManagement from "./ReportManagement"
import ReportAssign from "./ReportAssign"
import Setting from "./Setting"
import ReportTracking from "./ReportTracking"
import ReportInProgress from "./ReportInProgress"
import ReportCompleted from "./ReportCompleted"
import CompletedReport from "./CompletedReport"
import AReportAssign from "./AReportAssign"
import ATaskAssigned from "./ATaskAssigned"
import FeedbackRating from "./FeedbackRating"
import ReportRated from "./ReportRated"
import UserDetails from "./UserDetails"
import Profile from "./Profile"

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          {/* Place the "Login" route outside of the Container */}
          <PrivateRoute exact path="/ManagerDashboard" component={ManagerDashboard} />
          <PrivateRoute exact path="/ReportManagement" component={ReportManagement} />
          <PrivateRoute exact path="/ReportTracking" component={ReportTracking} />
          <PrivateRoute exact path="/CompletedReport" component={CompletedReport} />
          <PrivateRoute exact path="/FeedbackRating" component={FeedbackRating} />
          <PrivateRoute exact path="/AdminDashboard" component={AdminDashboard} />
          <PrivateRoute exact path="/AgentDashboard" component={AgentDashboard} />
          <PrivateRoute exact path="/ATaskAssigned" component={ATaskAssigned} />
          <PrivateRoute exact path="/UserManagement" component={UserManagement} />
          <PrivateRoute exact path="/Profile" component={Profile} />

          <PrivateRoute path="/report2/:reportId" component={ReportAssign} />
          <PrivateRoute path="/report3/:reportId" component={ReportInProgress} />
          <PrivateRoute path="/report4/:reportId" component={ReportCompleted} />
          <PrivateRoute path="/report5/:reportId" component={AReportAssign} />
          <PrivateRoute path="/report6/:reportId" component={ReportRated} />
          <PrivateRoute path="/UserDetails/:userId" component={UserDetails} />


          {/* Other routes inside the Container */}
          <Container
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "100vh" }}
          >
            <div className="w-100" style={{ maxWidth: "400px" }}>
              <PrivateRoute exact path="/update-profile" component={UpdateProfile} />
              <PrivateRoute exact path="/signup" component={Signup} />
              {/* <PrivateRoute exact path="/user-management" component={UserManagement} /> */}
              <PrivateRoute exact path="/Setting" component={Setting} />

              <Route path="/forgot-password" component={ForgotPassword} />
              <Route exact path="/" component={Login} /> {/* Login page as root */}

            </div>
          </Container>
        </Switch>
      </AuthProvider>
    </Router>
  )
}
export default App
