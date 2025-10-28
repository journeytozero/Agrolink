import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../api";
import Navbar from "../components/Navbar";

export default function BrowseProducts() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");

  // 🧩 Fetch all products
  useEffect(() => {
    api
      .get("/products", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setProducts(res.data))
      .catch(() =>
        Swal.fire("❌ Error", "Failed to load products. Try again later.", "error")
      );
  }, [token]);

  // 🧩 Handle Order
  const handleOrder = async (product) => {
    const { value: quantity } = await Swal.fire({
      title: `🛒 Order ${product.name}`,
      input: "number",
      inputLabel: `Available: ${product.quantity} ${product.unit}`,
      inputPlaceholder: "Enter quantity to order",
      showCancelButton: true,
      confirmButtonText: "Place Order",
      confirmButtonColor: "#28a745",
      inputAttributes: {
        min: 1,
        max: product.quantity,
        step: 1,
      },
      inputValidator: (value) => {
        if (!value) return "Please enter a quantity!";
        if (isNaN(value)) return "Enter a valid number!";
        if (value <= 0) return "Quantity must be greater than 0!";
        if (parseInt(value) > product.quantity)
          return `You can’t order more than ${product.quantity} ${product.unit}!`;
        return null;
      },
    });

    if (!quantity) return;

    try {
      await api.post(
        "/orders",
        { product_id: product.id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire(
        "✅ Order Placed!",
        `${quantity} ${product.unit} of ${product.name} ordered successfully.`,
        "success"
      );
    } catch (err) {
      console.error(err);
      Swal.fire("❌ Error", "Failed to place order!", "error");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="fw-bold text-success mb-3">🛒 Browse Products</h2>
        {products.length === 0 ? (
          <div className="alert alert-info">No products available.</div>
        ) : (
          <div className="row">
            {products.map((p) => (
              <div className="col-md-4 mb-4" key={p.id}>
                <div className="card shadow-sm border-0 h-100">
                  <img
                    src={`http://127.0.0.1:8000/storage/${p.image}`}
                    className="card-img-top"
                    alt={p.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="fw-bold">{p.name}</h5>
                    <p className="text-muted mb-1">{p.category || "Uncategorized"}</p>
                    <p className="mb-1">
                      💰 <strong>৳{p.price}</strong> per {p.unit}
                    </p>
                    <p className="mb-2 text-secondary">
                      📦 <strong>{p.quantity}</strong> {p.unit} available
                    </p>
                    <button
                      onClick={() => handleOrder(p)}
                      className="btn btn-outline-success mt-auto"
                      disabled={p.quantity <= 0}
                    >
                      {p.quantity > 0 ? "🛒 Order Now" : "❌ Out of Stock"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
