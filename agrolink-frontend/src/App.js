import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import AdminRevenueReport from "./pages/roles/AdminRevenueReport";
import AdminAnalytics from "./pages/roles/AdminAnalytics";
import AdminProducts from "./pages/roles/AdminProducts";
import AdminUsers from "./pages/roles/AdminUsers";
import MyProducts from "./pages/MyProducts";
import FarmerAnalytics from "./pages/roles/FarmerAnalytics";
import MarketDemandAnalytics from "./pages/roles/MarketDemandAnalytics";
import ManageOrders from "./pages/roles/ManageOrders";
import MyOrders from "./pages/MyOrders";
import BrowseProducts from "./pages/BrowseProducts";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
// import AdminCategories from "./pages/AdminCategories";
import FarManageOrder from "./pages/roles/FarManageOrder";


export default function App() {
  // ✅ Fix: Define storedUser inside App()
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <Router>
      <Routes>
        {/* 🧾 Auth Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* 🧭 Common Dashboard Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/my-products" element={<MyProducts />} />
         
        {/* 🧑‍🌾 Farmer Routes */}
        <Route path="/farmer/analytics" element={<FarmerAnalytics user={storedUser} />}/>
        <Route path="/farmer/orders" element={<FarManageOrder />} />

        {/* Buyer Dashboard */}

        <Route path="/products" element={<BrowseProducts />} />
        <Route path="/my-orders" element={<MyOrders />} />

        {/* 🧑‍💼 Admin Routes */}
        <Route path="/admin/revenue" element={<AdminRevenueReport />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/market-demand" element={<MarketDemandAnalytics />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/orders" element={<ManageOrders />} />
        {/* ✅ Default fallback route */}
        {/* <Route path="*" element={<Navigate to="/login" />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        
        {/* <Route path="/admin/categories" element={<AdminCategories />} /> */}
      </Routes>
    </Router>
  );
}
