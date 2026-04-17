import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios.util";
import {toast} from 'react-hot-toast';
import {useAuth} from '../hooks/auth.hooks';

const RegisterPage = () => {
  const navigate = useNavigate();
  const {register}=useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const {message}=await register(form);
     toast.success(message);

      navigate("/login");
    } catch (err) {
        toast.error(err.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Register
        </h2>

        

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg"
          >
            {loading ? "Creating..." : "Register as admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;