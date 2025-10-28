import { useState, useEffect } from "react";
import api from "../api";
import Navbar from "../components/Navbar";

export default function BrowseProducts() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    api.get("/products", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setProducts(res.data))
      .catch(() => alert("Failed to load products"));
  }, [token]);

  const handleOrder = async (productId) => {
    const quantity = prompt("Enter quantity to order:");
    if (!quantity || isNaN(quantity)) return alert("Invalid quantity!");

    try {
      await api.post(
        "/orders",
        { product_id: productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Order placed successfully!");
    } catch {
      alert("❌ Failed to place order!");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="fw-bold text-success">🛒 Browse Products</h2>
        <div className="row">
          {products.map((p) => (
            <div className="col-md-4 mb-4" key={p.id}>
              <div className="card shadow-sm">
                <img
                  src={`http://127.0.0.1:8000/storage/${p.image}`}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                  alt={p.name}
                />
                <div className="card-body">
                  <h5>{p.name}</h5>
                  <p className="text-muted">{p.category}</p>
                  <p>৳{p.price}</p>
                  <button
                    onClick={() => handleOrder(p.id)}
                    className="btn btn-outline-success w-100"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
