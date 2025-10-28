import { useEffect, useState, useRef } from "react";
import api from "../../api";
import Navbar from "../../components/Navbar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [transporters, setTransporters] = useState([]);
  const [selectedTransporter, setSelectedTransporter] = useState("");
  const token = localStorage.getItem("token");
  const reportRef = useRef(null);

  // ✅ Fetch all orders (Admin or Farmer)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // নিশ্চিত করো যে ফিল্ডগুলো আছে
        const data = res.data.map((o) => ({
          id: o.id,
          product_name: o.product_name || o.product?.name || "N/A",
          buyer_name: o.buyer_name || o.buyer?.name || "N/A",
          quantity: o.quantity,
          total_price: o.total_price,
          status: o.status,
          created_at: o.created_at,
          transporter_id: o.transporter_id || null,
        }));

        setOrders(data);
        setFiltered(data);
      } catch (error) {
        console.error(error);
        Swal.fire("❌ Error", "Failed to load orders!", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  // 🔍 Filter Logic
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
          o.product_name?.toLowerCase().includes(q) ||
          o.buyer_name?.toLowerCase().includes(q)
      );
    }

    setFiltered(data);
  }, [search, statusFilter, orders]);

  // 🚚 Load Transporters
  const loadTransporters = async () => {
    try {
      const res = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransporters(res.data.filter((u) => u.role === "transporter"));
    } catch {
      Swal.fire("❌ Error", "Failed to load transporters!", "error");
    }
  };

  // 🔓 Open Transporter Modal
  const openAssignModal = (order) => {
    setSelectedOrder(order);
    setSelectedTransporter("");
    setShowModal(true);
    loadTransporters();
  };

  // ✅ Assign Transporter
  const assignTransporter = async () => {
    if (!selectedTransporter)
      return Swal.fire("⚠️ Warning", "Please select a transporter!", "warning");

    try {
      await api.put(
        `/admin/orders/${selectedOrder.id}`,
        { status: "approved", transporter_id: selectedTransporter },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id
            ? { ...o, status: "approved", transporter_id: selectedTransporter }
            : o
        )
      );

      Swal.fire({
        icon: "success",
        title: "✅ Transporter Assigned",
        text: "Order approved and transporter assigned successfully!",
        timer: 1500,
        showConfirmButton: false,
      });

      setShowModal(false);
    } catch {
      Swal.fire("❌ Error", "Failed to assign transporter!", "error");
    }
  };

  // 🔄 Update Order Status
  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(
        `/admin/orders/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );

      Swal.fire({
        icon: "success",
        title: `✅ Order ${newStatus}`,
        text: `Order has been marked as ${newStatus}.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire("❌ Error", "Failed to update order status!", "error");
    }
  };

  // 📄 Export PDF
  const exportPDF = async () => {
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const pdf = new jsPDF("p", "mm", "a4");
    const imgData = canvas.toDataURL("image/png");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("Order-Report.pdf");

    Swal.fire({
      icon: "success",
      title: "📄 Exported as PDF",
      text: "Your order report has been downloaded.",
      timer: 1200,
      showConfirmButton: false,
    });
  };

  // 📊 Export Excel
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "Orders.xlsx"
    );

    Swal.fire({
      icon: "success",
      title: "📘 Exported as Excel",
      text: "Your order data has been exported successfully!",
      timer: 1200,
      showConfirmButton: false,
    });
  };

  // 🕓 Loader
  if (loading)
    return (
      <>
        <Navbar />
        <div className="text-center mt-5">
          <div className="spinner-border text-success" role="status"></div>
          <p className="mt-3 text-muted">Loading Orders...</p>
        </div>
      </>
    );

  // 🧾 Render
  return (
    <>
      <Navbar />
      <div className="container mt-4" ref={reportRef}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
          <h2 className="fw-bold text-success mb-0">🧾 Manage Orders</h2>
          <div className="d-flex gap-2 flex-wrap">
            <button className="btn btn-danger btn-sm" onClick={exportPDF}>
              📄 Export PDF
            </button>
            <button className="btn btn-success btn-sm" onClick={exportExcel}>
              📘 Export Excel
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="d-flex gap-2 mb-3 flex-wrap">
          <input
            type="text"
            placeholder="Search order or buyer..."
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

        {/* Table */}
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-striped mb-0 align-middle">
              <thead className="table-success">
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Buyer</th>
                  <th>Qty</th>
                  <th>Total (৳)</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-3">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((o) => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.product_name}</td>
                      <td>{o.buyer_name}</td>
                      <td>{o.quantity}</td>
                      <td>৳{Number(o.total_price || 0).toFixed(2)}</td>
                      <td>
                        <span
                          className={`badge bg-${
                            o.status === "pending"
                              ? "warning text-dark"
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
                      <td>{new Date(o.created_at).toLocaleDateString("en-GB")}</td>
                      <td>
                        {o.status === "pending" && (
                          <>
                            <button
                              className="btn btn-outline-success btn-sm me-2"
                              onClick={() => openAssignModal(o)}
                            >
                              Approve & Assign
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => updateStatus(o.id, "cancelled")}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {o.status === "approved" && (
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => updateStatus(o.id, "delivered")}
                          >
                            Mark Delivered
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Assign Transporter</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Order ID:</strong> #{selectedOrder?.id}
                </p>
                <select
                  className="form-select"
                  value={selectedTransporter}
                  onChange={(e) => setSelectedTransporter(e.target.value)}
                >
                  <option value="">-- Select Transporter --</option>
                  {transporters.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={assignTransporter}>
                  ✅ Assign & Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
