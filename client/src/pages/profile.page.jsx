import { useEffect, useState } from "react";
import API from '../utils/axios.util';
import toast from "react-hot-toast";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  // Fetch current user
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/user/me");

      setUser(res.data.user);
      setForm({
        name: res.data.user.name,
        email: res.data.user.email,
      });
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/api/user/me/update`, form);
      toast.success("Profile updated");
      fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-2xl shadow max-w-md">
        <h1 className="text-xl font-bold mb-4">
          My Profile
        </h1>

        <div className="space-y-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <div className="text-sm text-gray-500">
            Role: {user?.role}
          </div>

          <button
            onClick={handleUpdate}
            className="w-full bg-black text-white py-2 rounded"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;