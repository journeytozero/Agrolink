import { useEffect, useState } from "react";
import api from "../../api";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import CountUp from "react-countup";

export default function FarmerDashboard({ user }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // 🧩 Fetch farmer's products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const myProducts = res.data.filter((p) => p.user_id === user.id);
        setProducts(myProducts);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load your products!");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [token, user.id]);

  if (loading) return <h4 className="text-center mt-5">Loading Dashboard...</h4>;

  // 🧮 Summary Stats
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const avgPrice = products.length
    ? (products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length).toFixed(2)
    : 0;

  return (
    <>
      {/* <Navbar /> */}
      <div className="container mt-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <div>
            <h2 className="fw-bold text-success">🌾 Farmer Dashboard</h2>
            <p className="text-muted mb-0">
              Welcome, <strong>{user.name}</strong>! Manage your products and sales easily.
            </p>
          </div>

          <div className="d-flex gap-2">
            <Link to="/add-product" className="btn btn-success">
              ➕ Add Product
            </Link>
            <Link to="/my-products" className="btn btn-outline-success">
              📦 My Products
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card shadow-sm text-center bg-success text-white">
              <div className="card-body">
                <h6>Total Products</h6>
                <h3><CountUp end={totalProducts} duration={2} /></h3>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm text-center bg-primary text-white">
              <div className="card-body">
                <h6>Total Stock (Items)</h6>
                <h3><CountUp end={totalStock} duration={2} /></h3>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm text-center bg-warning text-dark">
              <div className="card-body">
                <h6>Average Price (৳)</h6>
                <h3><CountUp end={avgPrice} duration={2} decimals={2} /></h3>
              </div>
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div className="card shadow-sm">
          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">📋 Your Products</h5>
            <Link to="/my-products" className="btn btn-sm btn-light">
              Manage All
            </Link>
          </div>
          <div className="table-responsive">
            <table className="table table-striped mb-0">
              <thead className="table-success">
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>
                      {p.image ? (
                        <img
                          src={`http://127.0.0.1:8000/storage/${p.image}`}
                          alt="product"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "6px",
                          }}
                        />
                      ) : (
                        <span className="text-muted">No Image</span>
                      )}
                    </td>
                    <td>{p.name}</td>
                    <td>{p.category || "N/A"}</td>
                    <td>৳{p.price}</td>
                    <td>{p.quantity}</td>
                    <td>{p.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length > 5 && (
            <div className="text-center py-3">
              <Link to="/my-products" className="btn btn-outline-success btn-sm">
                View All Products →
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
