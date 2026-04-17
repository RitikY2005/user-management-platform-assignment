import { useAuth } from "../hooks/auth.hooks";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h1 className="text-xl font-bold mb-4">
        Dashboard Overview
      </h1>

      <div className="space-y-2">
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>

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
      </div>
    </div>
  );
};

export default DashboardPage;