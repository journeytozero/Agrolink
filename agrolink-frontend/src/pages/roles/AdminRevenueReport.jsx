import { useEffect, useState, useRef } from "react";
import api from "../../api";
import Navbar from "../../components/Navbar";
import CountUp from "react-countup";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AdminRevenueReport({ user }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef(null);
  const token = localStorage.getItem("token");

  const currentUser = user || JSON.parse(localStorage.getItem("user")) || {};

  // 🧩 Fetch Revenue Data
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get("/admin/revenue-report", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReport(res.data);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load revenue report!");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [token]);

  if (loading) return <h4 className="text-center mt-5">Loading Report...</h4>;
  if (!report) return <h4 className="text-center mt-5">No data found!</h4>;

  // 🧮 Chart Data
  const barData = {
    labels: report.farmers.map((f) => f.name),
    datasets: [
      {
        label: "Farmer Sales (৳)",
        data: report.farmers.map((f) => f.total_sales),
        backgroundColor: "#0d6efd",
      },
      {
        label: "Commission (৳)",
        data: report.farmers.map((f) => f.commission),
        backgroundColor: "#ffc107",
      },
    ],
  };

  // 📘 Export Excel
  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(report.farmers);
    XLSX.utils.book_append_sheet(workbook, sheet, "Revenue Report");
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "AgroLink-RevenueReport.xlsx"
    );
  };

  // 📄 Export PDF
  const handleExportPDF = async () => {
    const element = reportRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(img, "PNG", 0, 0, width, height);
    pdf.save("AgroLink-RevenueReport.pdf");
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4" ref={reportRef}>
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
          <div>
            <h2 className="fw-bold text-success">💰 Commission & Revenue Report</h2>
            <p className="text-muted mb-0">
              Welcome, <strong>{currentUser?.name || "Admin"}</strong>
            </p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <button className="btn btn-danger btn-sm" onClick={handleExportPDF}>
              📄 PDF
            </button>
            <button className="btn btn-success btn-sm" onClick={handleExportExcel}>
              📘 Excel
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card text-center shadow-sm bg-primary text-white">
              <div className="card-body">
                <h6>Total Revenue</h6>
                <h3>
                  ৳<CountUp end={report.total_revenue} duration={2} />
                </h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center shadow-sm bg-warning text-dark">
              <div className="card-body">
                <h6>Commission Rate</h6>
                <h3>{(report.commission_rate * 100).toFixed(0)}%</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center shadow-sm bg-success text-white">
              <div className="card-body">
                <h6>Total Commission</h6>
                <h3>
                  ৳<CountUp end={report.total_commission} duration={2} />
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Farmer Table */}
        <div className="card shadow-sm mb-5">
          <div className="card-header bg-dark text-white">Farmer Sales Overview</div>
          <div className="table-responsive">
            <table className="table table-striped mb-0">
              <thead className="table-success">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Total Sales (৳)</th>
                  <th>Commission (৳)</th>
                </tr>
              </thead>
              <tbody>
                {report.farmers.map((f) => (
                  <tr key={f.id}>
                    <td>{f.id}</td>
                    <td>{f.name}</td>
                    <td>{f.email}</td>
                    <td>৳{parseFloat(f.total_sales || 0).toFixed(2)}</td>
                    <td>৳{parseFloat(f.commission || 0).toFixed(2)}</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart */}
        <div className="card shadow-sm mb-5">
          <div className="card-header bg-dark text-white text-center">
            📊 Farmer Sales vs Commission
          </div>
          <div className="card-body" style={{ height: "400px" }}>
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "bottom" } },
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
