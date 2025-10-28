import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api";
import Navbar from "../components/Navbar";

export default function EditProduct() {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    location: "",
    unit: "Kg",
    description: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || {};

  // 🧩 Unauthorized user redirect
  useEffect(() => {
    if (!token) {
      Swal.fire("⚠️ Login Required", "Please login first.", "warning");
      navigate("/login");
      return;
    }

    if (user.role !== "farmer" && user.role !== "admin") {
      Swal.fire("🚫 Access Denied", "You are not authorized to edit products.", "error");
      navigate("/dashboard");
      return;
    }

    // Fetch product data
    const fetchProduct = async () => {
      try {
        const res = await api.get("/products", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const product = res.data.find((p) => p.id === parseInt(id));
        if (!product) {
          Swal.fire("❌ Not Found", "Product not found!", "error");
          navigate("/dashboard");
          return;
        }

        if (user.role === "farmer" && product.user_id !== user.id) {
          Swal.fire("🚫 Forbidden", "You can only edit your own products!", "error");
          navigate("/dashboard");
          return;
        }

        setForm({
          name: product.name,
          category: product.category || "",
          price: product.price,
          quantity: product.quantity,
          location: product.location,
          unit: product.unit || "Kg",
          description: product.description || "",
          image: null,
        });

        if (product.image)
          setPreview(`http://127.0.0.1:8000/storage/${product.image}`);
      } catch (err) {
        console.error(err);
        Swal.fire("❌ Error", "Failed to load product!", "error");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate, token, user]);

  // 🧩 Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 🧩 Handle Image Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🧩 Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.name || !form.price || !form.quantity || !form.location) {
      Swal.fire("⚠️ Missing Fields", "Please fill all required fields.", "warning");
      return;
    }

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key] !== null) formData.append(key, form[key]);
    });

    try {
      await api.post(`/products/${id}?_method=PUT`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        title: "✅ Success!",
        text: "Product updated successfully!",
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
      });

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      Swal.fire("❌ Error", "Failed to update product!", "error");
    }
  };

  if (loading)
    return <h4 className="text-center mt-5 text-muted">Loading product...</h4>;

  return (
    <>
      <Navbar />
      <div className="container mt-5" style={{ maxWidth: "650px" }}>
        <div className="card shadow border-0 p-4">
          <h3 className="text-center text-success mb-4">✏️ Edit Product</h3>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Product Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Category */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Category</label>
              <select
                name="category"
                className="form-select"
                value={form.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                <option>শাকসবজি</option>
                <option>ফলমূল</option>
                <option>চাল</option>
                <option>ধান-গমজাত পণ্য</option>
                <option>ডাল</option>
                <option>মসলা</option>
                <option>শুকনো পণ্য</option>
                <option>তেল ও মধু</option>
                <option>ডিম - দুধ</option>
                <option>মাংস</option>
                <option>মাছ ও মাছজাত পণ্য</option>
                <option>জৈব সার ও কৃষি উপকরণ</option>
                <option>অন্যান্য</option>
              </select>
            </div>

            {/* Price */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Price (৳)</label>
              <input
                type="number"
                name="price"
                className="form-control"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            {/* Quantity */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Quantity</label>
              <input
                type="number"
                name="quantity"
                className="form-control"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </div>

            {/* Unit */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Unit</label>
              <select
                name="unit"
                className="form-select"
                value={form.unit}
                onChange={handleChange}
              >
                <option value="Kg">Kg</option>
                <option value="Liter">Liter</option>
                <option value="Pcs">Pieces</option>
                <option value="Packet">Packet</option>
                <option value="Pound">Pound</option>
              </select>
            </div>

            {/* Location */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Location</label>
              <input
                type="text"
                name="location"
                className="form-control"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                name="description"
                className="form-control"
                rows="3"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter product details (optional)"
              ></textarea>
            </div>

            {/* Image Upload */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Product Image</label>
              <input
                type="file"
                className="form-control"
                onChange={handleImageChange}
              />
              {preview && (
                <div className="mt-3 text-center">
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      width: "200px",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-success w-100 fw-semibold">
              ✅ Update Product
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
