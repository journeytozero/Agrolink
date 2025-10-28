import { Link } from "react-router-dom";

export default function QuickNav({ role }) {
  const navItems = {
    farmer: [
      { label: "➕ Add Product", to: "/add-product", color: "success" },
      { label: "📦 My Products", to: "/dashboard", color: "primary" },
    ],
    buyer: [
      { label: "🛒 Browse Products", to: "/dashboard", color: "info" },
      { label: "💬 Contact Farmers", to: "/messages", color: "success" },
    ],
    transporter: [
      { label: "🚚 Delivery Requests", to: "/dashboard", color: "warning" },
      { label: "📍 Route Tracking", to: "/tracking", color: "primary" },
    ],
    admin: [
      { label: "👥 Manage Users", to: "/admin", color: "danger" },
      { label: "📊 Manage Products", to: "/dashboard", color: "primary" },
    ],
  };

  const links = navItems[role] || [];

  return (
    <div className="bg-light py-3 border-bottom shadow-sm">
      <div className="container d-flex flex-wrap justify-content-center gap-3">
        {links.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className={`btn btn-${item.color} fw-semibold`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
