import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api";
import Swal from "sweetalert2";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // ✅ Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
        setFiltered(res.data);
      } catch (err) {
        Swal.fire("❌ Error", "Failed to load your orders!", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  // 🔍 Filter Orders
  useEffect(() => {
    let data = [...orders];

    if (statusFilter !== "all") {
      data = data.filter((o) => o.status === statusFilter);
    }

    if (search.trim() !== "") {
      const q = search.toLowerCase();
      data = data.filter(
        (o) =>
          o.id.toString().includes(q) ||
          o.product?.name?.toLowerCase().includes(q)
      );
    }

    setFiltered(data);
  }, [search, statusFilter, orders]);

  // 🌀 Loading State
  if (loading)
    return (
      <>
        <Navbar />
        <div className="text-center mt-5">
          <div className="spinner-border text-success" role="status"></div>
          <p className="mt-3 text-muted">Loading Your Orders...</p>
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="fw-bold text-success mb-4 text-center">
          🌾 My Orders
        </h2>

        {/* Filters */}
        <div className="d-flex gap-2 mb-3 flex-wrap justify-content-center">
          <input
            type="text"
            placeholder="Search by product..."
            className="form-control form-control-sm"
            style={{ maxWidth: "250px" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="form-select form-select-sm"
            style={{ maxWidth: "200px" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-striped mb-0 align-middle">
              <thead className="table-success">
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Total (৳)</th>
                  <th>Status</th>
                  <th>Transporter</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-3">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((o) => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.product?.name || "N/A"}</td>
                      <td>{o.quantity}</td>
                      <td>৳{Number(o.total_price || 0).toFixed(2)}</td>
                      <td>
                        <span
                          className={`badge bg-${
                            o.status === "pending"
                              ? "warning"
                              : o.status === "approved"
                              ? "primary"
                              : o.status === "delivered"
                              ? "success"
                              : "danger"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td>{o.transporter?.name || "—"}</td>
                      <td>
                        {new Date(o.created_at).toLocaleDateString("en-GB")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
