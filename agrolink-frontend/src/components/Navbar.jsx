import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // 🧩 Fetch user info from backend or localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      api
        .get("/user", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success px-4 shadow-sm">
      <div className="container-fluid">
        {/* 🌾 Brand */}
        <Link className="navbar-brand fw-bold text-white" to="/">
          🌾 AgroLink
        </Link>

        {/* Toggle Button (for mobile) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu Items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            {!user ? (
              <>
                {/* 🔹 Public Links */}
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/register">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                {/* 🔹 Common Links */}
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/dashboard">
                    Dashboard
                  </Link>
                </li>

                {/* 🔸 Farmer Menu */}
                {user.role === "farmer" && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link text-white" to="/add-product">
                        Add Product
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link text-white" to="/my-products">
                        My Products
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link text-white" to="/farmer/orders">
                        My Orders
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link text-warning fw-bold"
                        to="/farmer/analytics"
                      >
                        📊 My Analytics
                      </Link>
                    </li>
                  </>
                )}

                {/* 🔸 Buyer Menu */}
                {user.role === "buyer" && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link text-white" to="/products">
                        Browse Products
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link text-warning fw-bold"
                        to="/my-orders"
                      >
                        📦 My Orders
                      </Link>
                    </li>
                  </>
                )}

                {/* 🔸 Transporter Menu */}
                {user.role === "transporter" && (
                  <li className="nav-item">
                    <Link
                      className="nav-link text-warning fw-bold"
                      to="/transporter/dashboard"
                    >
                      🚚 My Deliveries
                    </Link>
                  </li>
                )}

                {/* 🔸 Admin Menu */}
                {user.role === "admin" && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link text-white" to="/admin/users">
                        Manage Users
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link text-white"
                        to="/admin/products"
                      >
                        Manage Products
                      </Link>
                    </li>
                    
                    <li className="nav-item">
                      <Link
                        className="nav-link text-white"
                        to="/admin/orders"
                      >
                        🧾 Manage Orders
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link text-warning fw-bold"
                        to="/admin/market-demand"
                      >
                        📈 Market Demand
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link text-warning fw-bold"
                        to="/admin/analytics"
                      >
                        📊 Analytics
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link text-warning fw-bold"
                        to="/admin/revenue"
                      >
                        💰 Revenue Report
                      </Link>
                    </li>
                  </>
                )}

                {/* 🔹 Logout Button */}
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
