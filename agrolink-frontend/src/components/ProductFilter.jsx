import { useState, useMemo } from "react";
import { Row, Col, Form, Button, Card, Pagination, Modal } from "react-bootstrap";
import { motion } from "framer-motion";

export default function ProductFilter({ products, onAddToCart }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // 🔹 Filtering Logic
  const filtered = useMemo(() => {
    let data = products.filter((p) => {
      const matchSearch =
        search.trim() === "" ||
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "all" || p.category === category;
      const matchLocation = location === "all" || p.location === location;
      const matchPrice =
        priceRange === "all"
          ? true
          : priceRange === "low"
          ? p.price <= 100
          : priceRange === "mid"
          ? p.price > 100 && p.price <= 500
          : p.price > 500;

      return matchSearch && matchCategory && matchLocation && matchPrice;
    });

    if (sortBy === "price_low") data.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_high") data.sort((a, b) => b.price - a.price);
    else if (sortBy === "latest")
      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return data;
  }, [products, search, category, location, priceRange, sortBy]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentProducts = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const uniqueCategories = [...new Set(products.map((p) => p.category))].filter(Boolean);
  const uniqueLocations = [...new Set(products.map((p) => p.location))].filter(Boolean);

  return (
    <section className="container py-5">
      <h2 className="fw-bold text-center text-success mb-4">🌾 Featured Products</h2>

      {/* 🔍 Filter Controls */}
      <Row className="justify-content-center g-2 mb-4">
        <Col xs={12} sm={6} md={3} lg={2}>
          <Form.Control
            type="text"
            placeholder=" Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>

        <Col xs={12} sm={6} md={3} lg={2}>
          <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </Form.Select>
        </Col>

        <Col xs={12} sm={6} md={3} lg={2}>
          <Form.Select value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="all">All Locations</option>
            {uniqueLocations.map((loc) => (
              <option key={loc}>{loc}</option>
            ))}
          </Form.Select>
        </Col>

        <Col xs={12} sm={6} md={3} lg={2}>
          <Form.Select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
            <option value="all">All Prices</option>
            <option value="low">৳0 - ৳100</option>
            <option value="mid">৳100 - ৳500</option>
            <option value="high">৳500+</option>
          </Form.Select>
        </Col>

        <Col xs={12} sm={6} md={3} lg={2}>
          <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="latest"> Latest</option>
            <option value="price_low">⬇️ Price: Low → High</option>
            <option value="price_high">⬆️ Price: High → Low</option>
          </Form.Select>
        </Col>
      </Row>

      {/* 🛍️ Product Grid */}
      {currentProducts.length === 0 ? (
        <p className="text-center text-muted">No products found.</p>
      ) : (
        <Row className="g-4">
          {currentProducts.map((p) => (
            <Col key={p.id} xs={12} sm={6} md={4} lg={3}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="h-100 shadow-sm border-0 product-card">
                  <Card.Img
                    variant="top"
                    src={
                      p.image
                        ? `http://127.0.0.1:8000/storage/${p.image}`
                        : "https://via.placeholder.com/400x300?text=No+Image"
                    }
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body className="text-center">
                    <Card.Title className="text-success fw-bold">{p.name}</Card.Title>
                    <Card.Text className="text-muted small mb-1">{p.category}</Card.Text>
                    <Card.Text className="fw-semibold text-dark mb-2">৳{p.price}</Card.Text>
                    <Card.Text className="text-muted small mb-3">
                      {p.description?.slice(0, 50) || "No description available"}...
                    </Card.Text>
                    <div className="d-flex justify-content-center gap-2">
                      <Button variant="success" size="sm" onClick={() => onAddToCart(p)}>
                        🛒 Add
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => setSelectedProduct(p)}
                      >
                        🔍 View
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      )}

      {/* 🔢 Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i}
                active={i + 1 === currentPage}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}

      {/* 🪟 Product Details Modal */}
      <Modal
        show={!!selectedProduct}
        onHide={() => setSelectedProduct(null)}
        centered
        size="lg"
      >
        {selectedProduct && (
          <>
            <Modal.Header closeButton className="bg-success text-white">
              <Modal.Title>{selectedProduct.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={5} className="text-center">
                  <img
                    src={
                      selectedProduct.image
                        ? `http://127.0.0.1:8000/storage/${selectedProduct.image}`
                        : "https://via.placeholder.com/400x300?text=No+Image"
                    }
                    alt={selectedProduct.name}
                    className="img-fluid rounded shadow-sm"
                  />
                </Col>
                <Col md={7}>
                  <p><strong>Category:</strong> {selectedProduct.category}</p>
                  <p><strong>Price:</strong> ৳{selectedProduct.price}</p>
                  <p><strong>Available Quantity:</strong> {selectedProduct.quantity}</p>
                  <p><strong>Location:</strong> {selectedProduct.location || "Not specified"}</p>
                  <p className="mt-3"><strong>Description:</strong> {selectedProduct.description || "No description"}</p>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={() => onAddToCart(selectedProduct)}>
                🛒 Add to Cart
              </Button>
              <Button variant="secondary" onClick={() => setSelectedProduct(null)}>
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* 🌿 Hover Effect */}
      <style>{`
        .product-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }
      `}</style>
    </section>
  );
}
