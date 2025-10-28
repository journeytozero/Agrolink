import { useState } from "react";
import Swal from "sweetalert2";
import api from "../api";
import Navbar from "../components/Navbar";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("Kg");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const token = localStorage.getItem("token");

  // 🟢 Category dropdown options (বাংলা)
  const categoryOptions = [
    "শাকসবজি",
    "ফলমূল",
    "চাল",
    "ধান-গমজাত পণ্য",
    "ডাল",
    "মসলা",
    "শুকনো পণ্য",
    "তেল ও মধু",
    "ডিম - দুধ",
    "মাংস",
    "মাছ ও মাছজাত পণ্য",
    "জৈব সার ও কৃষি উপকরণ",
    "অন্যান্য",
  ];

  // 🟢 Unit options
  const unitOptions = ["Kg", "Liter", "Pcs", "Packet", "Pound"];

  // 🧩 Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !quantity || !location || !category) {
      Swal.fire("⚠️ Warning", "Please fill all required fields!", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("unit", unit);
    formData.append("category", category);
    formData.append("location", location);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      await api.post("/products", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire("🎉 Success", "Product added successfully!", "success");

      // Reset form
      setName("");
      setPrice("");
      setQuantity("");
      setLocation("");
      setCategory("");
      setUnit("Kg");
      setDescription("");
      setImage(null);
    } catch (err) {
      console.error("Error adding product:", err);
      Swal.fire("❌ Error", "Failed to add product", "error");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5" style={{ maxWidth: "650px" }}>
        <div className="card shadow p-4 border-0">
          <h3 className="fw-bold text-success text-center mb-4">
            🌾 Add New Product
          </h3>

          <form onSubmit={handleSubmit}>
            {/* Product Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Product Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Price */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Price (৳)</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            {/* Quantity */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Quantity</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            {/* Unit */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Unit</label>
              <select
                className="form-select"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                {unitOptions.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Location</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter product location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Enter short product description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            {/* Product Image */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Product Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-success w-100 fw-semibold">
              + Add Product
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
