import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import FarmerDashboard from "./roles/FarmerDashboard";
import BuyerDashboard from "./roles/BuyerDashboard";
import AdminDashboard from "./roles/AdminDashboard";
import TransporterDashboard from "./roles/TransporterDashboard";
import Navbar from "../components/Navbar";


export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get("/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (error) {
        console.error(error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) return <h3 className="text-center mt-5">Loading dashboard...</h3>;
  if (!user) return <h4 className="text-center mt-5">Unauthorized access.</h4>;

  // ✅ Dashboard.jsx
return (
  <>
    <Navbar />  {/* ✅ Keep only here */}
    {user.role === "farmer" && <FarmerDashboard user={user} />}
    {user.role === "buyer" && <BuyerDashboard user={user} />}
    {user.role === "admin" && <AdminDashboard user={user} />}
    {user.role === "transporter" && <TransporterDashboard user={user} />}
  </>
);

}
