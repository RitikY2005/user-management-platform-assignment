import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../utils/axios.util";
import ConfirmDialog from "../components/confirm-dialog";
import useDebounce from "../hooks/useDebounce.hooks";
import UserModal from "../components/create-user";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    role: "",
    status: "",
    page: 1,
  });

  const debouncedSearch = useDebounce(filters.search);

  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        ...filters,
        search: debouncedSearch,
      }).toString();

      const res = await API.get(`/api/user?${params}`);

      setUsers(res.data.users);
      setPagination({
        total: res.data.total,
        pages: res.data.pages,
      });
    } catch (error){
      toast.error(error.response?.data?.message|| "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch, filters.role, filters.status, filters.page]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
      page: 1,
    });
  };

  // CREATE / UPDATE
  const handleSubmit = async (data) => {
    try {
      if (editUser) {
        await API.put(`/api/user/${editUser._id}`, data);
        toast.success("User updated");
      } else {
        await API.post(`/api/user`, data);
        toast.success("User created");
      }

      setModalOpen(false);
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  // DELETE CONFIRM
  const confirmDelete = (id) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      const response = await API.delete(`/api/user/${selectedId}`);
      toast.success(response.data.message);
      fetchUsers();
    } catch (error){
     
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setConfirmOpen(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-2xl shadow">
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-bold">Users</h1>

          <button
            onClick={() => {
              setEditUser(null);
              setModalOpen(true);
            }}
            className="bg-black text-white px-4 py-2 rounded"
          >
            + Create User
          </button>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <input
            name="search"
            placeholder="Search..."
            className="border p-2 rounded"
            onChange={handleFilterChange}
          />

          <select name="role" onChange={handleFilterChange} className="border p-2 rounded">
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="USER">User</option>
          </select>

          <select name="status" onChange={handleFilterChange} className="border p-2 rounded">
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.status}</td>

                  <td className="space-x-2">
                    <button
                      onClick={() => {
                        setEditUser(u);
                        setModalOpen(true);
                      }}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => confirmDelete(u._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>


        )}
        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <button
            disabled={filters.page === 1}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                page: prev.page - 1,
              }))
            }
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <div className="text-sm">
            Page <span className="font-semibold">{filters.page}</span> of{" "}
            <span className="font-semibold">{pagination.pages}</span>
          </div>

          <button
            disabled={filters.page === pagination.pages}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                page: prev.page + 1,
              }))
            }
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* MODALS */}
      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editUser}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to deactivate this user?"
      />
    </div>
  );
};

export default UsersPage;