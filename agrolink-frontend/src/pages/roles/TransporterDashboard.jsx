import { useEffect, useState } from "react";
import api from "../../api";
import Navbar from "../../components/Navbar";

export default function TransporterDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const token = localStorage.getItem("token");

  // 🧾 Fetch all assigned orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/transporter/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("❌ Failed to load transporter orders:", err);
        alert("Failed to load orders!");
      }
    };
    fetchOrders();
  }, [token]);

  // 📍 Update Transporter Location
  const updateLocation = async (orderId) => {
    if (!navigator.geolocation) {
      alert("❌ Geolocation not supported!");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        await api.put(
          `/transporter/orders/${orderId}/location`,
          {
            delivery_lat: position.coords.latitude,
            delivery_lng: position.coords.longitude,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("✅ Location updated successfully!");
      } catch {
        alert("❌ Failed to update location!");
      }
    });
  };

  // 🚚 Update delivery status
  const updateStatus = async (id, newStatus) => {
    setLoading(true);
    try {
      await api.put(
        `/transporter/orders/${id}`,
        { delivery_status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update state instantly
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, delivery_status: newStatus } : order
        )
      );

      alert(`✅ Status updated to "${newStatus}"`);
    } catch (err) {
      console.error("❌ Failed to update delivery status:", err);
      alert("Failed to update delivery status!");
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Filter orders by tab
  const activeOrders = orders.filter(
    (o) =>
      o.delivery_status !== "delivered" &&
      ["pending", "picked", "in_transit"].includes(o.delivery_status)
  );
  const completedOrders = orders.filter(
    (o) => o.delivery_status === "delivered"
  );

  // 🧾 Render Table
  const renderTable = (list, isCompleted = false) => {
    if (list.length === 0)
      return (
        <div className="text-center py-4 text-muted">
          {isCompleted
            ? "No completed deliveries yet ✅"
            : "No active deliveries yet 🚚"}
        </div>
      );

    return (
      <table className="table table-striped align-middle">
        <thead className={isCompleted ? "table-secondary" : "table-success"}>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Buyer</th>
            <th>Quantity</th>
            <th>Pickup Location</th>
            <th>Status</th>
            {!isCompleted && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {list.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.product?.name}</td>
              <td>{o.buyer?.name}</td>
              <td>{o.quantity}</td>
              <td>{o.product?.location || "N/A"}</td>
              <td>
                <span
                  className={`badge bg-${
                    o.delivery_status === "pending"
                      ? "warning"
                      : o.delivery_status === "picked"
                      ? "primary"
                      : o.delivery_status === "in_transit"
                      ? "info"
                      : "success"
                  }`}
                >
                  {o.delivery_status}
                </span>
              </td>

              {!isCompleted && (
                <td>
                  {o.delivery_status === "pending" && (
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      disabled={loading}
                      onClick={() => updateStatus(o.id, "picked")}
                    >
                      Mark Picked
                    </button>
                  )}
                  {o.delivery_status === "picked" && (
                    <button
                      className="btn btn-outline-info btn-sm me-2"
                      disabled={loading}
                      onClick={() => updateStatus(o.id, "in_transit")}
                    >
                      In Transit
                    </button>
                  )}
                  {o.delivery_status === "in_transit" && (
                    <button
                      className="btn btn-outline-success btn-sm me-2"
                      disabled={loading}
                      onClick={() => updateStatus(o.id, "delivered")}
                    >
                      Delivered
                    </button>
                  )}

                  {/* 📍 Update Location Button */}
                  <button
                    className="btn btn-outline-dark btn-sm"
                    onClick={() => updateLocation(o.id)}
                  >
                    📍 Update Location
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="container mt-4">
        <h2 className="fw-bold text-primary mb-3">🚛 Transporter Dashboard</h2>

        {/* Tabs */}
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "active" ? "active fw-bold" : ""
              }`}
              onClick={() => setActiveTab("active")}
            >
              Active Deliveries
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "completed" ? "active fw-bold" : ""
              }`}
              onClick={() => setActiveTab("completed")}
            >
              Completed Deliveries
            </button>
          </li>
        </ul>

        {/* Orders Table */}
        <div className="card shadow-sm mt-3">
          <div className="table-responsive">
            {activeTab === "active"
              ? renderTable(activeOrders)
              : renderTable(completedOrders, true)}
          </div>
        </div>
      </div>
    </>
  );
}
