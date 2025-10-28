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
import { Pie, Bar, Line } from "react-chartjs-2";

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

export default function AdminAnalytics({ user }) {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef(null);
  const token = localStorage.getItem("token");

  // ✅ fallback for user
  const currentUser = user || JSON.parse(localStorage.getItem("user")) || {};

  // 🧩 Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, productsRes] = await Promise.all([
          api.get("/admin/users", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/products", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setUsers(usersRes.data);
        setProducts(productsRes.data);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load analytics data!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <h4 className="text-center mt-5">Loading Analytics...</h4>;

  // 🧠 Analytics Data
  const totalUsers = users.length;
  const totalProducts = products.length;

  const roleCounts = users.reduce(
    (acc, u) => {
      acc[u.role] = (acc[u.role] || 0) + 1;
      return acc;
    },
    { admin: 0, farmer: 0, buyer: 0, transporter: 0 }
  );

  const categoryCounts = products.reduce(
    (acc, p) => {
      const category = p.category || "Uncategorized";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    {}
  );

  const monthlyStats = Array(12).fill(0);
  products.forEach((p) => {
    if (p.created_at) {
      const month = new Date(p.created_at).getMonth();
      monthlyStats[month]++;
    }
  });

  // 🥧 Pie Chart — User Roles
  const roleChartData = {
    labels: Object.keys(roleCounts),
    datasets: [
      {
        data: Object.values(roleCounts),
        backgroundColor: ["#dc3545", "#198754", "#0dcaf0", "#ffc107"],
        borderWidth: 1,
      },
    ],
  };

  // 📊 Bar Chart — Product Categories
  const categoryChartData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Products by Category",
        data: Object.values(categoryCounts),
        backgroundColor: "#0d6efd",
      },
    ],
  };

  // 📈 Line Chart — Monthly Product Growth
  const monthlyChartData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    datasets: [
      {
        label: "Products Added per Month",
        data: monthlyStats,
        borderColor: "#198754",
        backgroundColor: "rgba(25,135,84,0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // 🧾 Export to PDF
  const handleExportPDF = async () => {
    const element = reportRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`AgroLink-Analytics-${new Date().toLocaleDateString()}.pdf`);
  };

  // 📊 Export to CSV
  const handleExportCSV = () => {
    const csvData = products.map((p) => ({
      ID: p.id,
      Name: p.name,
      Category: p.category,
      Price: p.price,
      Quantity: p.quantity,
      Location: p.location,
      Farmer: p.user?.name || "Unknown",
    }));

    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "AgroLink-Products.csv");
  };

  // 📘 Export to Excel
  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();
    const userSheet = XLSX.utils.json_to_sheet(users);
    const productSheet = XLSX.utils.json_to_sheet(products);
    XLSX.utils.book_append_sheet(workbook, userSheet, "Users");
    XLSX.utils.book_append_sheet(workbook, productSheet, "Products");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "AgroLink-Analytics.xlsx");
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4" ref={reportRef}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
          <div>
            <h2 className="fw-bold text-primary">📊 Admin Analytics Dashboard</h2>
            <p className="text-muted mb-0">
              Welcome, <strong>{currentUser?.name || "Admin"}</strong> 👋 Here’s your data overview.
            </p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <button onClick={handleExportPDF} className="btn btn-danger btn-sm">
              📄 PDF
            </button>
            <button onClick={handleExportCSV} className="btn btn-warning btn-sm">
              📊 CSV
            </button>
            <button onClick={handleExportExcel} className="btn btn-success btn-sm">
              📘 Excel
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card shadow-sm text-center bg-success text-white">
              <div className="card-body">
                <h6>Total Users</h6>
                <h3><CountUp end={totalUsers} duration={2} /></h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm text-center bg-primary text-white">
              <div className="card-body">
                <h6>Total Products</h6>
                <h3><CountUp end={totalProducts} duration={2} /></h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm text-center bg-warning text-dark">
              <div className="card-body">
                <h6>Farmers</h6>
                <h3><CountUp end={roleCounts.farmer} duration={2} /></h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm text-center bg-info text-dark">
              <div className="card-body">
                <h6>Buyers</h6>
                <h3><CountUp end={roleCounts.buyer} duration={2} /></h3>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="row mb-5">
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-dark text-white text-center">
                User Role Distribution
              </div>
              <div className="card-body d-flex justify-content-center">
                <div style={{ width: "300px", height: "300px" }}>
                  <Pie data={roleChartData} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-dark text-white text-center">
                Products by Category
              </div>
              <div className="card-body" style={{ height: "350px" }}>
                <Bar data={categoryChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="card shadow-sm mb-5">
          <div className="card-header bg-dark text-white text-center">
            📈 Product Growth (Monthly Trend)
          </div>
          <div className="card-body" style={{ height: "400px" }}>
            <Line data={monthlyChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </>
  );
}
