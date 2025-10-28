import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import NavbarH from "../components/NavbarH";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "farmer",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/register", form);

      await Swal.fire({
        icon: "success",
        title: "🎉 Registration Successful!",
        text: "Welcome to AgroLink 🌾",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/login");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed ❌",
        text:
          err.response?.data?.message ||
          "Something went wrong. Please try again.",
        confirmButtonColor: "#198754",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🌾 Navbar */}
      <NavbarH />

      {/* 🌿 Background */}
      <div
        className="d-flex justify-content-center align-items-center vh-100 position-relative"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/929385/pexels-photo-929385.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          overflow: "hidden",
        }}
      >
        {/* 🔅 Overlay for blur effect */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(4px)",
          }}
        ></div>

        {/* 🌾 Registration Card */}
        <motion.div
          className="card shadow-lg border-0 position-relative"
          style={{
            width: "450px",
            borderRadius: "1rem",
            zIndex: 2,
            backgroundColor: "rgba(255,255,255,0.9)",
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="card-body p-4">
            <motion.h3
              className="text-center fw-bold text-success mb-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              🌾 Join AgroLink
            </motion.h3>

            <p className="text-center text-muted mb-4">
              Create your account and be part of the digital farming revolution.
            </p>

            {/* 👤 Full Name */}
            <div className="mb-3">
              <label className="form-label text-success fw-semibold">
                👤 Full Name
              </label>
              <input
                className="form-control shadow-sm"
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            {/* 📧 Email */}
            <div className="mb-3">
              <label className="form-label text-success fw-semibold">
                📧 Email
              </label>
              <input
                type="email"
                className="form-control shadow-sm"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            {/* 🔒 Password */}
            <div className="mb-3">
              <label className="form-label text-success fw-semibold">
                🔒 Password
              </label>
              <input
                type="password"
                className="form-control shadow-sm"
                placeholder="Create a password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {/* 🌾 Role */}
            <div className="mb-3">
              <label className="form-label text-success fw-semibold">
                🌾 Register as
              </label>
              <select
                className="form-select shadow-sm"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="farmer">👨‍🌾 Farmer</option>
                <option value="buyer">🛍️ Buyer</option>
              </select>
            </div>

            {/* 🚀 Submit */}
            <motion.button
              type="submit"
              className="btn btn-success w-100 fw-semibold shadow-sm py-2"
              onClick={handleSubmit}
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? "Registering..." : "Register"}
            </motion.button>

            {/* 🔗 Login Link */}
            <p className="text-center mt-3 text-muted">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-success fw-bold text-decoration-none"
              >
                Login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
