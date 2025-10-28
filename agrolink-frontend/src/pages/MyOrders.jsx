import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../api";
import Navbar from "../components/Navbar";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");

  // 🔹 Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await api.get("/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else {
        Swal.fire("⚠️ Warning", "Unexpected server response format.", "warning");
      }
    } catch (err) {
      console.error("❌ Failed to fetch orders:", err);
      Swal.fire("❌ Error", "Failed to load your orders!", "error");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Load Orders Initially + Auto Refresh Every 15s
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [token]);

  // 🔍 Open Modal
  const openModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // ❌ Close Modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-5">
          <div className="spinner-border text-success" role="status"></div>
          <h5 className="mt-3 text-muted">Loading your orders...</h5>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
          <h2 className="fw-bold text-success mb-0">🧾 My Orders</h2>
          <button
            className="btn btn-outline-success btn-sm"
            onClick={() => {
              Swal.fire({
                title: "🔄 Refreshing...",
                text: "Fetching latest order updates...",
                timer: 1000,
                showConfirmButton: false,
              });
              fetchOrders();
            }}
          >
            Refresh
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="alert alert-info text-center">
            You haven’t placed any orders yet.
          </div>
        ) : (
          <div className="card shadow-sm">
            <div className="table-responsive">
              <table className="table table-striped mb-0 align-middle">
                <thead className="table-success">
                  <tr>
                    <th>ID</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Total (৳)</th>
                    <th>Status</th>
                    <th>Delivery</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.product?.name || "Unknown Product"}</td>
                      <td>{order.quantity}</td>
                      <td>৳{Number(order.total_price || 0).toFixed(2)}</td>
                      <td>
                        <span
                          className={`badge bg-${
                            order.status === "pending"
                              ? "warning"
                              : order.status === "approved"
                              ? "primary"
                              : order.status === "delivered"
                              ? "success"
                              : "danger"
                          }`}
                        >
                          {order.status || "N/A"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge bg-${
                            order.delivery_status === "delivered"
                              ? "success"
                              : order.delivery_status === "in_transit"
                              ? "info"
                              : order.delivery_status === "picked"
                              ? "primary"
                              : "secondary"
                          }`}
                        >
                          {order.delivery_status || "Pending"}
                        </span>
                      </td>
                      <td>
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString("en-GB")
                          : "—"}
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-success btn-sm"
                          onClick={() => openModal(order)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 🧩 Modal */}
      <Modal show={showModal} onHide={closeModal} centered size="lg">
        {selectedOrder && (
          <>
            <Modal.Header closeButton className="bg-success text-white">
              <Modal.Title>
                Order #{selectedOrder.id} Details
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <div className="row">
                {/* 🖼 Product Info */}
                <div className="col-md-5 text-center mb-3">
                  <img
                    src={
                      selectedOrder.product?.image
                        ? `http://127.0.0.1:8000/storage/${selectedOrder.product.image}`
                        : "https://via.placeholder.com/400x300?text=No+Image"
                    }
                    alt={selectedOrder.product?.name || "Product"}
                    className="img-fluid rounded shadow-sm mb-3"
                  />
                  <h5 className="fw-bold text-success">
                    {selectedOrder.product?.name}
                  </h5>
                  <p className="text-muted mb-0">
                    {selectedOrder.product?.category || "N/A"}
                  </p>
                </div>

                {/* 📋 Order Info */}
                <div className="col-md-7">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <strong>Quantity:</strong> {selectedOrder.quantity}
                    </li>
                    <li className="list-group-item">
                      <strong>Total Price:</strong> ৳
                      {Number(selectedOrder.total_price || 0).toFixed(2)}
                    </li>
                    <li className="list-group-item">
                      <strong>Status:</strong>{" "}
                      <span className="badge bg-primary">{selectedOrder.status}</span>
                    </li>
                    <li className="list-group-item">
                      <strong>Delivery Status:</strong>{" "}
                      <span className="badge bg-success">
                        {selectedOrder.delivery_status || "Pending"}
                      </span>
                    </li>
                    <li className="list-group-item">
                      <strong>Transporter:</strong>{" "}
                      {selectedOrder.transporter?.name || "Not assigned yet"}
                    </li>
                    <li className="list-group-item">
                      <strong>Order Date:</strong>{" "}
                      {selectedOrder.created_at
                        ? new Date(selectedOrder.created_at).toLocaleString()
                        : "—"}
                    </li>
                  </ul>
                </div>
              </div>

              {/* 🗺 Map */}
              {selectedOrder.delivery_lat && selectedOrder.delivery_lng ? (
                <div className="mt-4">
                  <h6 className="fw-bold text-success mb-2">
                    🚚 Live Delivery Location:
                  </h6>
                  <iframe
                    title="delivery-map"
                    width="100%"
                    height="350"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${selectedOrder.delivery_lat},${selectedOrder.delivery_lng}&hl=en&z=14&output=embed`}
                  ></iframe>
                </div>
              ) : (
                <p className="text-muted mt-3 text-center">
                  No live location shared yet.
                </p>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
}
