import { motion } from "framer-motion";
import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaArrowUp } from "react-icons/fa"; // ✅ Added icons

export default function Footer() {
  // 🌿 Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="text-white pt-5 position-relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1b5e20, #2e7d32, #388e3c)",
      }}
    >
      {/* 🌱 Main Footer Content */}
      <motion.div
        className="container pb-5"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <Row className="gy-4">
          {/* 🌿 Logo & About */}
          <Col md={4}>
            <h3 className="fw-bold text-white">🌾 AgroLink</h3>
            <p className="text-light small">
              AgroLink বাংলাদেশের কৃষিকে ডিজিটালভাবে উন্নত করতে কাজ করছে।  
              আমরা কৃষক, ক্রেতা এবং পরিবহনকারীদের একত্রিত করছি একটি স্মার্ট  
              মার্কেটপ্লেসে — যেখানে প্রযুক্তিই সেতুবন্ধন।
            </p>
          </Col>

          {/* 🔗 Quick Links */}
          <Col md={2}>
            <h5 className="fw-bold text-white mb-3">Quick Links</h5>
            <ul className="list-unstyled small">
              {[
                { label: "🏠 Home", link: "/" },
                { label: "🌱 About", link: "/about" },
                { label: "🛒 Products", link: "/products" },
                { label: "📞 Contact", link: "/contact" },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  whileHover={{ scale: 1.1, x: 5 }}
                  transition={{ duration: 0.3 }}
                  className="mb-2"
                >
                  <Link
                    to={item.link}
                    className="text-light text-decoration-none"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </Col>

          {/* 📬 Newsletter */}
          <Col md={6}>
            <h5 className="fw-bold text-white mb-3">📩 Join Our Newsletter</h5>
            <p className="small text-light">
              Subscribe now to get the latest updates on products, offers & agri news.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("✅ Thank you for subscribing!");
              }}
              className="d-flex flex-column flex-sm-row gap-2"
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="form-control form-control-sm border-0 shadow-sm"
                style={{ maxWidth: "300px" }}
              />
              <Button
                variant="light"
                size="sm"
                className="fw-semibold px-3 shadow-sm"
              >
                Subscribe
              </Button>
            </form>
          </Col>
        </Row>

        <hr className="border-light mt-4" />

        {/* 🌍 Bottom Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="mb-2 mb-md-0 small">
            © {new Date().getFullYear()} <strong>AgroLink</strong> — Empowering Farmers Digitally 🌾
          </p>

          {/* 🌐 Social Links */}
          <div className="d-flex gap-3">
            {[
              { icon: "facebook", link: "https://facebook.com" },
              { icon: "instagram", link: "https://instagram.com" },
              { icon: "twitter", link: "https://twitter.com" },
              { icon: "linkedin", link: "https://linkedin.com" },
            ].map((s, i) => (
              <motion.a
                key={i}
                href={s.link}
                target="_blank"
                rel="noreferrer"
                className="text-white fs-5"
                whileHover={{ scale: 1.2, y: -3 }}
              >
                <i className={`bi bi-${s.icon}`}></i>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 💬 Floating WhatsApp Button (React Icons Version) */}
      <motion.div
        className="position-fixed d-flex justify-content-center align-items-center rounded-circle shadow"
        style={{
          width: "60px",
          height: "60px",
          bottom: "25px",
          right: "25px",
          background: "linear-gradient(135deg, #25D366, #128C7E)",
          zIndex: 2000,
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120, delay: 0.4 }}
        whileHover={{
          scale: 1.15,
          rotate: 10,
          boxShadow: "0 6px 25px rgba(37, 211, 102, 0.6)",
        }}
      >
        <a
          href="https://wa.me/8801756861338"
          target="_blank"
          rel="noreferrer"
          className="text-decoration-none"
        >
          <FaWhatsapp size={32} color="#fff" />
        </a>
      </motion.div>

      {/* 🌟 Floating Glow Effect */}
      <motion.div
        className="position-fixed rounded-circle"
        style={{
          width: "70px",
          height: "70px",
          bottom: "20px",
          right: "20px",
          background: "rgba(37, 211, 102, 0.25)",
          filter: "blur(25px)",
          zIndex: 1999,
        }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* 🌿 Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="position-fixed border-0 rounded-circle shadow"
        style={{
          width: "45px",
          height: "45px",
          bottom: "100px",
          right: "30px",
          background: "#ffffff",
          color: "#2e7d32",
          fontSize: "20px",
          zIndex: 1999,
        }}
        whileHover={{ scale: 1.2, backgroundColor: "#c8e6c9" }}
      >
        <FaArrowUp />
      </motion.button>
    </footer>
  );
}
