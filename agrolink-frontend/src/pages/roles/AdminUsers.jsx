import { useEffect, useState } from "react";
import api from "../../api";
import Navbar from "../../components/Navbar";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editUser, setEditUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  // 🧩 Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load users!");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  // 🧩 Delete User
  const handleDelete = async (id, role) => {
    if (role === "admin") return alert("🚫 Cannot delete another admin!");
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u.id !== id));
      alert("✅ User deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete user!");
    }
  };

  // 🧩 Edit User
  const handleEdit = (user) => {
    if (user.role === "admin") return alert("🚫 Cannot edit another admin!");
    setEditUser(user);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await api.put(`/admin/users/${editUser.id}`, editUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.map((u) => (u.id === editUser.id ? res.data.user : u)));
      setShowModal(false);
      alert("✅ User updated successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update user!");
    }
  };

  // 🧩 Filtered Data
  const filteredUsers = users.filter((u) => {
    const matchName = u.name.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchName && matchRole;
  });

  if (loading) return <h4 className="text-center mt-5">Loading Users...</h4>;

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="fw-bold text-danger mb-3">👥 Manage Users</h2>
        <p className="text-muted">View, edit, and remove users from the system.</p>

        {/* Filters */}
        <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
          <input
            type="text"
            className="form-control w-auto"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="form-select w-auto"
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

        {/* Users Table */}
        <div className="card shadow-sm">
          <div className="card-body table-responsive">
            <table className="table table-striped">
              <thead className="table-success">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
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
                              onClick={() => handleEdit(u)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDelete(u.id, u.role)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-3">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5>Edit User</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  value={editUser.name}
                  onChange={(e) =>
                    setEditUser({ ...editUser, name: e.target.value })
                  }
                  placeholder="Name"
                />
                <input
                  type="email"
                  className="form-control mb-2"
                  value={editUser.email}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                  placeholder="Email"
                />
                <select
                  className="form-select"
                  value={editUser.role}
                  onChange={(e) =>
                    setEditUser({ ...editUser, role: e.target.value })
                  }
                >
                  <option value="farmer">Farmer</option>
                  <option value="buyer">Buyer</option>
                  <option value="transporter">Transporter</option>
                </select>
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
