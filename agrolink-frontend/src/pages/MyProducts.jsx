import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../api";
import Navbar from "../components/Navbar";

export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  // 🧩 Fetch farmer’s products
  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const res = await api.get("/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = JSON.parse(localStorage.getItem("user"));
        const myProducts = res.data.filter((p) => p.user_id === user.id);
        setProducts(myProducts);
      } catch (err) {
        console.error(err);
        Swal.fire("❌ Error", "Failed to load your products!", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchMyProducts();
  }, [token]);

  // 🗑️ Delete product
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This product will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p.id !== id));

      Swal.fire("✅ Deleted!", "Product deleted successfully!", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("❌ Error", "Failed to delete product!", "error");
    }
  };

  // ✏️ Edit product
  const handleEdit = (product) => {
    setEditProduct({ ...product });
    setShowModal(true);
  };

  // 💾 Update product
  const handleUpdate = async () => {
    try {
      const res = await api.put(`/products/${editProduct.id}`, editProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(
        products.map((p) => (p.id === editProduct.id ? res.data.product : p))
      );
      setShowModal(false);

      Swal.fire("✅ Updated!", "Product updated successfully!", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("❌ Error", "Failed to update product!", "error");
    }
  };

  if (loading)
    return <h4 className="text-center mt-5 text-muted">Loading your products...</h4>;

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="fw-bold text-success mb-3">🌾 My Products</h2>
        <p className="text-muted">
          Manage your products — you can update or delete them anytime.
        </p>

        {products.length === 0 ? (
          <div className="alert alert-info">You haven’t added any products yet.</div>
        ) : (
          <div className="card shadow-sm">
            <div className="card-body table-responsive">
              <table className="table table-striped align-middle">
                <thead className="table-success">
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Location</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>
                        {p.image ? (
                          <img
                            src={`http://127.0.0.1:8000/storage/${p.image}`}
                            alt={p.name}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                          />
                        ) : (
                          <span className="text-muted">No Image</span>
                        )}
                      </td>
                      <td>{p.name}</td>
                      <td>{p.category || "N/A"}</td>
                      <td>৳{p.price}</td>
                      <td>{p.quantity}</td>
                      <td>{p.unit}</td>
                      <td>{p.location}</td>
                      <td>
                        <button
                          className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => handleEdit(p)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(p.id)}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 🧩 Edit Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5>Edit Product</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  value={editProduct.name}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, name: e.target.value })
                  }
                  placeholder="Product Name"
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  value={editProduct.category}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, category: e.target.value })
                  }
                  placeholder="Category"
                />
                <input
                  type="number"
                  className="form-control mb-2"
                  value={editProduct.price}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, price: e.target.value })
                  }
                  placeholder="Price"
                />
                <input
                  type="number"
                  className="form-control mb-2"
                  value={editProduct.quantity}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, quantity: e.target.value })
                  }
                  placeholder="Quantity"
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  value={editProduct.unit}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, unit: e.target.value })
                  }
                  placeholder="Unit (Kg, Liter, etc.)"
                />
                <input
                  type="text"
                  className="form-control"
                  value={editProduct.location}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, location: e.target.value })
                  }
                  placeholder="Location"
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={handleUpdate}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
