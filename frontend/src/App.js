import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { useState } from "react";
import Register from "./pages/Register";
import JobPostForm from "./pages/JobPostForm";
import JobList from "./pages/JobList";
import Applications from "./pages/Applications";
import AdminDashboard from "./pages/AdminDashboard";
import EditProfile from "./pages/EditProfile";
import UserList from "./pages/UserList";
import ConnectionRequests from "./pages/ConnectionRequests";
import MyConnections from "./pages/MyConnections";
import MessageThread from "./pages/MessageThread";
import Feed from "./pages/Feed";
import AdminFlaggedJobs from "./pages/AdminFlaggedJobs";



function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post-job" element={<JobPostForm />} />
          <Route path="/jobs" element={<JobList />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/connections" element={<ConnectionRequests />} />
        <Route path="/my-connections" element={<MyConnections />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/messages/:userId" element={<MessageThread />} />
        <Route path="/admin-flagged-jobs" element={<AdminFlaggedJobs />} />
        <Route path="/profile" element={<Profile user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
