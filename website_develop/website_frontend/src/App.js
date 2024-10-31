// export default App;
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute"; // Import the ProtectedRoute component
import LogInPage from "./Pages/LogInPage";
import PageNotFound from "./Pages/PageNoFound";
import MainPage from "./Pages/Paperbase";
import HistoryPage from "./Pages/ReportLibrary";
import ResetPassword from "./Pages/ResetPage";
import SettingPage from "./Pages/SettingPage";
import SignUpPage from "./Pages/SignUpPage";
import ProfilePage from "./Pages/ProfilePage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<LogInPage />} />
        <Route path="/pagenotfound" element={<PageNotFound />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Protected routes */}
        <Route
          path="/mainpage"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />

        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
