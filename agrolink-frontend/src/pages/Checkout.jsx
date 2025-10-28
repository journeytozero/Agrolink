import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api";
import Navbar from "../components/Navbar";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("inside"); // inside/outside Dhaka
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🧩 Load user & cart
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setCart(storedCart.map((item) => ({ ...item, quantity: 1 })));
    setUser(storedUser);
  }, []);

  // 🧮 Calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + item.quantity * parseFloat(item.price || 0),
    0
  );
  const deliveryRate = location === "inside" ? 0.07 : 0.13;
  const deliveryCharge = subtotal * deliveryRate;
  const total = subtotal + deliveryCharge;

  // 🛒 Quantity controls
  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // 🧾 Checkout Logic
  const handleCheckout = async () => {
    if (cart.length === 0)
      return Swal.fire("🛒 Empty Cart", "Please add items before checkout.", "info");

    if (!user) {
      Swal.fire("⚠️ Login Required", "Please log in to continue checkout.", "warning");
      navigate("/login");
      return;
    }

    if (!address.trim()) {
      Swal.fire("📍 Address Missing", "Please provide your delivery address.", "info");
      return;
    }

    setLoading(true);

    try {
      await api.post(
        "/checkout",
        {
          user_id: user.id,
          address,
          location,
          items: cart.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal,
          delivery_charge: deliveryCharge,
          total_price: total,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      // 🎉 SweetAlert success popup
      Swal.fire({
        title: "🎉 Thank You!",
        text: `Your order has been placed successfully.\nTotal: ৳${total.toFixed(2)}`,
        icon: "success",
        confirmButtonText: "Go to My Orders",
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: true,
        backdrop: `
          rgba(0,0,0,0.4)
          left top
          no-repeat
        `,
      }).then(() => {
        localStorage.removeItem("cart");
        navigate("/my-orders");
      });
    } catch (err) {
      console.error("Checkout failed:", err);
      Swal.fire("❌ Error", "Failed to place your order. Try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-5">
          <h4>Your cart is empty 🛒</h4>
          <button className="btn btn-success mt-3" onClick={() => navigate("/")}>
            Go Shopping
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h2 className="fw-bold text-success mb-4">🧾 Checkout</h2>

        <div className="row">
          {/* Left Section */}
          <div className="col-md-8">
            {/* Items */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Your Items</h5>
                {cart.map((item, idx) => (
                  <div
                    key={idx}
                    className="d-flex justify-content-between align-items-center border-bottom py-2"
                  >
                    <div>
                      <b>{item.name}</b>
                      <p className="text-muted small mb-0">
                        ৳{item.price} × {item.quantity} = ৳
                        {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => decreaseQty(item.id)}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => increaseQty(item.id)}
                      >
                        +
                      </button>
                    </div>
                    <img
                      src={
                        item.image
                          ? `http://127.0.0.1:8000/storage/${item.image}`
                          : "https://via.placeholder.com/80x60?text=No+Image"
                      }
                      alt={item.name}
                      style={{
                        width: "80px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "5px",
                      }}
                    />
                  </div>
                ))}
                <h5 className="mt-3 text-end">
                  Subtotal:{" "}
                  <span className="text-success fw-bold">
                    ৳{subtotal.toFixed(2)}
                  </span>
                </h5>
              </div>
            </div>

            {/* Delivery Section */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Delivery Details</h5>
                <label className="form-label">Delivery Address</label>
                <textarea
                  className="form-control mb-3"
                  rows="3"
                  placeholder="Enter your delivery address..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                ></textarea>

                <label className="form-label">Location</label>
                <select
                  className="form-select"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="inside">Inside Dhaka (+7%)</option>
                  <option value="outside">Outside Dhaka (+13%)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Order Summary</h5>
                <p>Subtotal: ৳{subtotal.toFixed(2)}</p>
                <p>
                  Delivery Charge:{" "}
                  <span className="text-muted">
                    ({location === "inside" ? "7%" : "13%"})
                  </span>{" "}
                  ৳{deliveryCharge.toFixed(2)}
                </p>
                <hr />
                <h5>Total: ৳{total.toFixed(2)}</h5>

                <button
                  className="btn btn-success w-100 mt-3"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Confirm Checkout"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
