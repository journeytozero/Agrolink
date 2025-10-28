import { motion } from "framer-motion";
import { Row, Col } from "react-bootstrap";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Rahim Mia",
      role: "🌾 Farmer, Bogura",
      text: "AgroLink এর মাধ্যমে আমি আমার ফসলের ন্যায্য দাম পাচ্ছি। মধ্যস্বত্বভোগী নেই, এখন আয় অনেক বেশি!",
      img: "https://images.pexels.com/photos/6715987/pexels-photo-6715987.jpeg",
    },
    {
      name: "Nasrin Akter",
      role: "🛍️ Buyer, Dhaka",
      text: "তাজা সবজি এবং ফল এখন খুব সহজে পাচ্ছি। ডেলিভারিও সময়মতো আসে — দারুণ উদ্যোগ!",
      img: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
    },
    {
      name: "Abdul Karim",
      role: "🚚 Transporter, Rajshahi",
      text: "AgroLink আমাকে নতুন ক্লায়েন্টের সাথে যুক্ত করেছে। এখন প্রতিদিন ডেলিভারি অর্ডার পাই!",
      img: "https://images.pexels.com/photos/243327/pexels-photo-243327.jpeg",
    },
  ];

  return (
    <section
      className="py-5"
      style={{
        background: "linear-gradient(180deg, #e8f8ed 0%, #ffffff 100%)",
      }}
    >
      <div className="container text-center">
        <motion.h2
          className="fw-bold text-success mb-5"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          💬 What Our Users Say
        </motion.h2>

        <Row className="g-4 justify-content-center">
          {testimonials.map((t, i) => (
            <Col key={i} md={4}>
              <motion.div
                className="p-4 bg-white rounded shadow border h-100 testimonial-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <motion.div
                  className="d-flex justify-content-center mb-3"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <img
                    src={t.img}
                    alt={t.name}
                    className="rounded-circle shadow-sm"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      border: "3px solid #4caf50",
                    }}
                  />
                </motion.div>
                <p className="text-muted fst-italic mb-3">“{t.text}”</p>
                <h6 className="fw-bold text-success mb-0">{t.name}</h6>
                <small className="text-muted">{t.role}</small>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* 🌾 Soft Animation Line */}
        <motion.div
          className="mt-5"
          initial={{ width: 0 }}
          whileInView={{ width: "80%" }}
          transition={{ duration: 1 }}
          style={{
            height: "3px",
            background: "linear-gradient(90deg, #4caf50, #81c784, #a5d6a7)",
            margin: "0 auto",
            borderRadius: "2px",
          }}
        />
      </div>

      {/* ✨ Hover Animation Style */}
      <style>{`
        .testimonial-card {
          transition: all 0.3s ease;
        }
        .testimonial-card:hover {
          box-shadow: 0 8px 20px rgba(0, 128, 0, 0.15);
        }
      `}</style>
    </section>
  );
}
