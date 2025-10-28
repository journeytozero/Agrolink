import { useEffect, useState, useRef } from "react";
import api from "../../api";
import Navbar from "../../components/Navbar";
import CountUp from "react-countup";
import { Line, Bar, Pie } from "react-chartjs-2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

export default function FarmerAnalytics({ user }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [monthlySales, setMonthlySales] = useState(Array(12).fill(0));
  const token = localStorage.getItem("token");
  const reportRef = useRef(null);

  // 🧩 Fetch farmer's products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/products", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter current farmer’s products
        const myProducts = res.data.filter((p) => p.user_id === user.id);
        setProducts(myProducts);

        // Total revenue (price * quantity)
        const revenue = myProducts.reduce(
          (sum, p) => sum + (parseFloat(p.price || 0) * parseFloat(p.quantity || 0)),
          0
        );
        setTotalRevenue(revenue);

        // Category counts
        const categoryMap = {};
        myProducts.forEach((p) => {
          const cat = p.category || "Uncategorized";
          categoryMap[cat] = (categoryMap[cat] || 0) + 1;
        });
        setCategoryCounts(categoryMap);

        // Monthly data (simulate created_at if available)
        const monthly = Array(12).fill(0);
        myProducts.forEach((p) => {
          if (p.created_at) {
            const month = new Date(p.created_at).getMonth();
            monthly[month]++;
          }
        });
        setMonthlySales(monthly);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load analytics!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, user.id]);

  if (loading) return <h4 className="text-center mt-5">Loading Analytics...</h4>;

  // 🧾 Export PDF
  const handleExportPDF = async () => {
    const element = reportRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Farmer-Analytics-${user.name}.pdf`);
  };

  // 📊 Charts Data
  const categoryChartData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Products per Category",
        data: Object.values(categoryCounts),
        backgroundColor: ["#198754", "#0dcaf0", "#ffc107", "#dc3545"],
      },
    ],
  };

  const monthlyChartData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    datasets: [
      {
        label: "Products Added per Month",
        data: monthlySales,
        backgroundColor: "rgba(13, 110, 253, 0.3)",
        borderColor: "#0d6efd",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const revenuePerCategory = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Revenue by Category (৳)",
        data: Object.keys(categoryCounts).map((cat) => {
          return products
            .filter((p) => (p.category || "Uncategorized") === cat)
            .reduce((sum, p) => sum + (p.price * p.quantity || 0), 0);
        }),
        backgroundColor: ["#20c997", "#0dcaf0", "#ffc107", "#dc3545"],
      },
    ],
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4" ref={reportRef}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
          <div>
            <h2 className="fw-bold text-success">📈 Farmer Analytics</h2>
            <p className="text-muted mb-0">
              Overview of your products, categories, and sales trends.
            </p>
          </div>
          <button className="btn btn-danger btn-sm" onClick={handleExportPDF}>
            📄 Export PDF
          </button>
        </div>

        {/* Summary Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card shadow-sm text-center bg-success text-white">
              <div className="card-body">
                <h6>Total Products</h6>
                <h3><CountUp end={products.length} duration={2} /></h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm text-center bg-primary text-white">
              <div className="card-body">
                <h6>Total Stock</h6>
                <h3>
                  <CountUp
                    end={products.reduce((s, p) => s + (p.quantity || 0), 0)}
                    duration={2}
                  />
                </h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm text-center bg-warning text-dark">
              <div className="card-body">
                <h6>Total Revenue (৳)</h6>
                <h3><CountUp end={totalRevenue} duration={2} decimals={2} /></h3>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="row mb-5">
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-dark text-white text-center">
                Product Distribution by Category
              </div>
              <div className="card-body d-flex justify-content-center">
                <div style={{ width: "300px", height: "300px" }}>
                  <Pie data={categoryChartData} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-dark text-white text-center">
                Revenue by Category (৳)
              </div>
              <div className="card-body">
                <Bar data={revenuePerCategory} />
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Growth */}
        <div className="card shadow-sm mb-5">
          <div className="card-header bg-dark text-white text-center">
            Monthly Product Growth
          </div>
          <div className="card-body" style={{ height: "400px" }}>
            <Line data={monthlyChartData} />
          </div>
        </div>
      </div>
    </>
  );
}
