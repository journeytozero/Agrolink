import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import NavbarH from "../components/NavbarH"; // ✅ AgroLink Navbar

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/login", form);
      localStorage.setItem("token", res.data.token);

      await Swal.fire({
        icon: "success",
        title: "🎉 Login Successful!",
        text: "Welcome back to AgroLink 🌾",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/dashboard");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login Failed 😢",
        text: "Invalid email or password. Please try again.",
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

      {/* 🌱 Background with overlay */}
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

        {/* 🪴 Login Card */}
        <motion.div
          className="card shadow-lg border-0 position-relative"
          style={{
            width: "420px",
            borderRadius: "1rem",
            zIndex: 2,
            backgroundColor: "rgba(255,255,255,0.9)",
          }}
          initial={{ opacity: 0, y: 40 }}
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
              🌾 Welcome to AgroLink
            </motion.h3>

            <p className="text-center text-muted mb-4">
              Sign in to continue your journey with us.
            </p>

            {/* 📨 Email */}
            <div className="mb-3">
              <label className="form-label text-success fw-semibold">
                📧 Email Address
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
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {/* 🚀 Login */}
            <motion.button
              type="submit"
              className="btn btn-success w-100 fw-semibold shadow-sm py-2"
              onClick={handleSubmit}
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>

            {/* 🔗 Register / Forgot Password */}
            <p className="text-center mt-3 text-muted">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-success fw-bold text-decoration-none"
              >
                Register
              </Link>
            </p>
            <p className="text-center">
              <Link
                to="/forgot-password"
                className="text-success small text-decoration-none"
              >
                Forgot Password?
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
