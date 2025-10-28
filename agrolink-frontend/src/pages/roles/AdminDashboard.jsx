import { useEffect, useState } from "react";
import api from "../../api";
import Navbar from "../../components/Navbar";

export default function AdminDashboard({ user }) {
  // 🔹 States
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [userSearch, setUserSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 5;

  // Modals
  const [showUserModal, setShowUserModal] = useState(false);
  const [editUser, setEditUser] = useState({});
  const [showProductModal, setShowProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState({});

  const token = localStorage.getItem("token");

  // 🧩 Fetch all data
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
        alert("❌ Failed to load admin data!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // 🧩 Filtered Data
  const filteredUsers = users.filter(
    (u) =>
      (roleFilter === "all" || u.role === roleFilter) &&
      u.name.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  // 🧩 Delete User
  const handleDeleteUser = async (id, role) => {
    if (role === "admin") return alert("🚫 Cannot delete another admin!");
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers((prev) => prev.filter((u) => u.id !== id));
      alert("✅ User deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete user!");
    }
  };

  // 🧩 Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert("✅ Product deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete product!");
    }
  };

  // 🧩 Edit User Modal
  const openUserModal = (u) => {
    if (u.role === "admin") return alert("🚫 Cannot edit another admin!");
    setEditUser(u);
    setShowUserModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      const res = await api.put(`/admin/users/${editUser.id}`, editUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === editUser.id ? res.data.user : u))
      );
      setShowUserModal(false);
      alert("✅ User updated successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update user!");
    }
  };

  // 🧩 Edit Product Modal
  const openProductModal = (p) => {
    setEditProduct(p);
    setShowProductModal(true);
  };

  const handleUpdateProduct = async () => {
    try {
      const res = await api.put(`/admin/products/${editProduct.id}`, editProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === editProduct.id ? res.data.product : p))
      );

      if (editProduct.newImage) {
        const formData = new FormData();
        formData.append("image", editProduct.newImage);
        await api.post(`/admin/products/${editProduct.id}/image`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("✅ Product image updated!");
      }

      setShowProductModal(false);
      alert("✅ Product updated successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update product!");
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / perPage);
  const paginatedUsers = filteredUsers.slice((page - 1) * perPage, page * perPage);

  if (loading) return <h4 className="text-center mt-5">Loading Admin Dashboard...</h4>;

  return (
    <>
      <div className="container mt-4">
        <h2 className="fw-bold text-danger mb-3">🧑‍💼 Admin Dashboard</h2>
        <p className="text-muted">Welcome, {user.name}. You have full control.</p>

        {/* USERS TABLE */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-dark text-white d-flex justify-content-between flex-wrap">
            <h5>👥 Users</h5>
            <div className="d-flex gap-2">
              <input
                type="text"
                placeholder="Search user..."
                className="form-control form-control-sm"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
              <select
                className="form-select form-select-sm"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="farmer">Farmer</option>
                <option value="buyer">Buyer</option>
                <option value="transporter">Transporter</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped mb-0">
              <thead className="table-success">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.role === "admin"
                            ? "bg-danger"
                            : u.role === "farmer"
                            ? "bg-success"
                            : u.role === "buyer"
                            ? "bg-info"
                            : "bg-warning"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td>
                      {u.role !== "admin" && (
                        <>
                          <button
                            className="btn btn-outline-primary btn-sm me-2"
                            onClick={() => openUserModal(u)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteUser(u.id, u.role)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center my-3">
              <ul className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i} className={`page-item ${page === i + 1 ? "active" : ""}`}>
                    <button className="page-link" onClick={() => setPage(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* PRODUCTS TABLE */}
        <div className="card shadow-sm mb-5">
          <div className="card-header bg-dark text-white d-flex justify-content-between flex-wrap">
            <h5>📦 Products</h5>
            <input
              type="text"
              placeholder="Search product..."
              className="form-control form-control-sm w-auto"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            <table className="table table-striped mb-0">
              <thead className="table-primary">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>৳{p.price}</td>
                    <td>{p.quantity}</td>
                    <td>{p.location}</td>
                    <td>
                      <button
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => openProductModal(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteProduct(p.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* USER EDIT MODAL */}
      {showUserModal && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5>Edit User</h5>
                <button className="btn-close" onClick={() => setShowUserModal(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  value={editUser.name}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                  placeholder="Name"
                />
                <input
                  type="email"
                  className="form-control mb-2"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  placeholder="Email"
                />
                <select
                  className="form-select"
                  value={editUser.role}
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                >
                  <option value="farmer">Farmer</option>
                  <option value="buyer">Buyer</option>
                  <option value="transporter">Transporter</option>
                </select>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowUserModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-success" onClick={handleUpdateUser}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT EDIT MODAL */}
      {showProductModal && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5>Edit Product</h5>
                <button className="btn-close" onClick={() => setShowProductModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-3">
                  {editProduct.image ? (
                    <img
                      src={`http://127.0.0.1:8000/storage/${editProduct.image}`}
                      alt="preview"
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  ) : (
                    <div className="text-muted">No Image Available</div>
                  )}
                </div>

                <input
                  type="file"
                  className="form-control mb-3"
                  accept="image/*"
                  onChange={(e) => setEditProduct({ ...editProduct, newImage: e.target.files[0] })}
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                  placeholder="Product Name"
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  value={editProduct.category}
                  onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                  placeholder="Category"
                />
                <input
                  type="number"
                  className="form-control mb-2"
                  value={editProduct.price}
                  onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                  placeholder="Price"
                />
                <input
                  type="number"
                  className="form-control mb-2"
                  value={editProduct.quantity}
                  onChange={(e) => setEditProduct({ ...editProduct, quantity: e.target.value })}
                  placeholder="Quantity"
                />
                <input
                  type="text"
                  className="form-control"
                  value={editProduct.location}
                  onChange={(e) => setEditProduct({ ...editProduct, location: e.target.value })}
                  placeholder="Location"
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowProductModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleUpdateProduct}>
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
