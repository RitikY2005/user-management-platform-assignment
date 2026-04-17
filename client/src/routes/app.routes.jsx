import { Routes, Route } from "react-router-dom";
import ProtectedRoute from './protected.routes';

import LoginPage from '../pages/login.page';
import DashboardPage from '../pages/dashboard.page';
import UsersPage from '../pages/users.page';
import ProfilePage from '../pages/profile.page';
import UnauthorizedPage from '../pages/unauthorized.page';
import NotFoundPage from '../pages/notfound.page';
import RegisterPage from "../pages/register.page";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute roles={["ADMIN", "ORGANIZER"]}>
            <UsersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;