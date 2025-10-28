import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api";
// import Cart from "../pages/Cart";

export default function Navbar({ cartCount }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) setUser(storedUser);
      else {
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
    }
  }, []);

  const handleDashboardRedirect = () => {
    if (!user) return navigate("/login");
    switch (user.role) {
      case "admin":
        navigate("/admin/analytics");
        break;
      case "farmer":
        navigate("/dashboard");
        break;
      case "buyer":
        navigate("/products");
        break;
      case "transporter":
        navigate("/transporter/dashboard");
        break;
      default:
        navigate("/dashboard");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success px-4 shadow-sm sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-white d-flex align-items-center" to="/">
          🌾 <span className="ms-1">AgroLink</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center fw-semibold">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">🏠 Home</Link>
            </li>
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle text-white bg-transparent border-0"
                data-bs-toggle="dropdown"
              >
                🛍️ Products
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                <li><Link className="dropdown-item" to="/products">All Products</Link></li>
                {/* <li><Link className="dropdown-item" to="/categories/fruits">Fruits</Link></li>
                <li><Link className="dropdown-item" to="/categories/vegetables">Vegetables</Link></li>
                <li><Link className="dropdown-item" to="/categories/grains">Grains</Link></li> */}
              </ul>
            </li>
            <li className="nav-item"><Link className="nav-link text-white" to="/about"> About</Link></li>
            <li className="nav-item"><Link className="nav-link text-white" to="/contact"> Contact</Link></li>

            <li className="nav-item">
              <button className="btn btn-outline-light btn-sm mx-2">
                🛒 Cart ({cartCount})
              </button>
            </li>

            {!user ? (
              <>
                <li className="nav-item"><Link className="nav-link text-white" to="/login"> Login</Link></li>
                <li className="nav-item"><Link className="nav-link text-white" to="/register"> Register</Link></li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle text-white bg-transparent border-0"
                  data-bs-toggle="dropdown"
                >
                   {user.name}
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                  <li><button className="dropdown-item" onClick={handleDashboardRedirect}> Dashboard</button></li>
                  <li><Link className="dropdown-item" to="/profile">⚙️ Profile</Link></li>
                  <li><button
                    className="dropdown-item text-danger"
                    onClick={() => {
                      localStorage.clear();
                      setUser(null);
                      navigate("/");
                    }}
                  >🚪 Logout</button></li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
