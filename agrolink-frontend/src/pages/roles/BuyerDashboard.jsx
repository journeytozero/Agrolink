import { useEffect, useState } from "react";
import api from "../../api";

export default function BuyerDashboard({ user }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchAll = async () => {
      const res = await api.get("/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    };
    fetchAll();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="text-primary">🛒 Welcome, {user.name}</h3>
      <p>Browse available farm products and connect with farmers.</p>
      <div className="row">
        {products.map((p) => (
          <div key={p.id} className="col-md-3 mb-3">
            <div className="card">
              <img
                src={`http://127.0.0.1:8000/storage/${p.image}`}
                alt={p.name}
                className="card-img-top"
                style={{ height: "150px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h6>{p.name}</h6>
                <p className="text-muted mb-0">৳{p.price}</p>
                <button className="btn btn-outline-success btn-sm w-100 mt-2">
                  Contact Farmer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
