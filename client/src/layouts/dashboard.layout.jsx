import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/auth.hooks";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="flex flex-col gap-2">

          <button
            onClick={() => navigate("/")}
            className="text-left px-3 py-2 rounded hover:bg-gray-200"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="text-left px-3 py-2 rounded hover:bg-gray-200"
          >
            Profile
          </button>

          {(user?.role === "ADMIN" || user?.role === "ORGANIZER") && (
            <button
              onClick={() => navigate("/users")}
              className="text-left px-3 py-2 rounded hover:bg-gray-200"
            >
              Users
            </button>
          )}

        </nav>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="font-semibold">Welcome, {user?.name}</h1>
          <span className="text-sm text-gray-500">
            Role: {user?.role}
          </span>
        </header>

        {/* Page Content */}
        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;