import {useAuth} from '../hooks/auth.hooks';
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-2xl shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">
            Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        <div className="space-y-3">
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
        </div>

        {/*based on role,change the ui */}
        <div className="mt-6">
          {user?.role === "ADMIN" && (
            <button
              onClick={() => navigate("/users")}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Manage Users
            </button>
          )}

          {user?.role === "MANAGER" && (
            <button
              onClick={() => navigate("/users")}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              View Users
            </button>
          )}

          {user?.role === "USER" && (
            <p className="text-gray-600">
              You can manage your profile only.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;