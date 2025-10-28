import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(items);
    const totalAmount = items.reduce((sum, p) => sum + parseFloat(p.price), 0);
    setTotal(totalAmount);
  }, []);

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await api.post(
        "/checkout",
        {
          cart: cart.map((item) => ({
            product_id: item.id,
            quantity: 1,
          })),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Order placed successfully!");
      localStorage.removeItem("cart");
      navigate("/my-orders");
    } catch (err) {
      alert("❌ Failed to checkout!");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-success mb-4">🛒 My Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>৳{p.price}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 className="text-end mt-3">Total: ৳{total.toFixed(2)}</h4>
          <button className="btn btn-success mt-3" onClick={handleCheckout}>
            Confirm Checkout
          </button>
        </>
      )}
    </div>
  );
}
