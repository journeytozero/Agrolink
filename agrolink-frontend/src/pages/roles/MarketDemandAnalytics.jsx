import { useEffect, useState, useRef } from "react";
import api from "../../api";
import Navbar from "../../components/Navbar";
import CountUp from "react-countup";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

export default function MarketDemandAnalytics() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const reportRef = useRef(null);

  // ✅ Fetch delivered orders with product info
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // এখন শুধুমাত্র delivered অর্ডারগুলো নেবো
        const res = await api.get("/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // শুধু delivered status ফিল্টার করো
        const delivered = res.data.filter((o) => o.status === "delivered");

        // প্রোডাক্ট অনুযায়ী চাহিদা হিসাব
        const productDemand = {};
        delivered.forEach((order) => {
          const p = order.product_name || (order.product?.name ?? "Unknown");
          if (!productDemand[p]) {
            productDemand[p] = {
              name: p,
              category: order.product?.category || "Uncategorized",
              price: order.product?.price || 0,
              quantity: order.quantity,
            };
          } else {
            productDemand[p].quantity += order.quantity;
          }
        });

        const productArray = Object.values(productDemand);
        setProducts(productArray);
        setOrders(delivered);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load market demand data!");
      } finally {
        setLoading(false);
      }
    };
    fetchMarketData();
  }, [token]);

  if (loading) return <h4 className="text-center mt-5">Loading Market Data...</h4>;

  // 🧮 Demand Insights
  const topProducts = [...products]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const lowStock = products.filter((p) => p.quantity < 5);

  // ✅ Category-based total demand
  const categoryDemand = products.reduce((acc, p) => {
    const cat = p.category || "Uncategorized";
    acc[cat] = (acc[cat] || 0) + (p.quantity || 0);
    return acc;
  }, {});

  // ✅ Monthly demand (based on order created_at)
  const monthlyDemand = Array(12).fill(0);
  orders.forEach((o) => {
    if (o.created_at && o.quantity) {
      const m = new Date(o.created_at).getMonth();
      monthlyDemand[m] += o.quantity;
    }
  });

  // 📈 Charts
  const categoryChart = {
    labels: Object.keys(categoryDemand),
    datasets: [
      {
        label: "Units Sold (Delivered Orders)",
        data: Object.values(categoryDemand),
        backgroundColor: "#198754",
      },
    ],
  };

  const monthlyChart = {
    labels: [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec",
    ],
    datasets: [
      {
        label: "Monthly Delivered Orders",
        data: monthlyDemand,
        borderColor: "#0d6efd",
        backgroundColor: "rgba(13,110,253,0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // 📄 Export PDF
  const handleExportPDF = async () => {
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("Market-Demand-Analytics.pdf");
  };

  // 📊 Export Excel
  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();
    const dataSheet = XLSX.utils.json_to_sheet(products);
    XLSX.utils.book_append_sheet(workbook, dataSheet, "Market Demand");
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "Market-Demand-Report.xlsx"
    );
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4" ref={reportRef}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-success">📈 Market Demand (Delivered Orders)</h2>
          <div className="d-flex gap-2">
            <button className="btn btn-danger btn-sm" onClick={handleExportPDF}>
              📄 Export PDF
            </button>
            <button className="btn btn-success btn-sm" onClick={handleExportExcel}>
              📘 Export Excel
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card text-center shadow-sm bg-primary text-white">
              <div className="card-body">
                <h6>Top Selling Products</h6>
                <h3><CountUp end={topProducts.length} duration={1.5} /></h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center shadow-sm bg-warning text-dark">
              <div className="card-body">
                <h6>Low Stock Items</h6>
                <h3><CountUp end={lowStock.length} duration={1.5} /></h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center shadow-sm bg-success text-white">
              <div className="card-body">
                <h6>Total Categories</h6>
                <h3><CountUp end={Object.keys(categoryDemand).length} duration={1.5} /></h3>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="row mb-5">
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-dark text-white text-center">
                Product Demand by Category
              </div>
              <div className="card-body" style={{ height: "300px" }}>
                <Bar data={categoryChart} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-dark text-white text-center">
                Monthly Delivered Demand
              </div>
              <div className="card-body" style={{ height: "300px" }}>
                <Line data={monthlyChart} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </div>

        {/* Top & Low Stock Tables */}
        <div className="row">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-success text-white">🔥 Top Delivered Products</div>
              <div className="table-responsive">
                <table className="table table-striped mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Delivered Qty</th>
                      <th>Price (৳)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((p) => (
                      <tr key={p.name}>
                        <td>{p.name}</td>
                        <td>{p.category}</td>
                        <td>{p.quantity}</td>
                        <td>{p.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-danger text-white">⚠️ Low Stock Products</div>
              <div className="table-responsive">
                <table className="table table-striped mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Delivered Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStock.map((p) => (
                      <tr key={p.name}>
                        <td>{p.name}</td>
                        <td>{p.category}</td>
                        <td>{p.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
