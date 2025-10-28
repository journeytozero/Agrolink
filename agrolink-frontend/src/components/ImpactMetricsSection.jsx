import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Row, Col } from "react-bootstrap";

// 🌱 Reusable Counter Component (No hook violation)
function Counter({ end, duration = 2000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(end / (duration / 30));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [end, duration]);

  return <>{count.toLocaleString()}</>;
}

export default function ImpactMetricsSection() {
  const metrics = [
    {
      title: "Empowered Farmers",
      value: 4200,
      icon: "👨‍🌾",
      color: "#4caf50",
      desc: "কৃষক যারা এখন AgroLink-এর মাধ্যমে ন্যায্য মূল্য পাচ্ছেন।",
    },
    {
      title: "Trusted Buyers",
      value: 3100,
      icon: "🛒",
      color: "#43a047",
      desc: "ক্রেতারা যারা এখন সরাসরি কৃষকের কাছ থেকে ফসল কিনছেন।",
    },
    {
      title: "Deliveries Completed",
      value: 8500,
      icon: "🚚",
      color: "#2e7d32",
      desc: "সফলভাবে সম্পন্ন হয়েছে এমন সরবরাহ ও পরিবহন অর্ডার।",
    },
    {
      title: "Tonnes of Produce Traded",
      value: 12750,
      icon: "🌾",
      color: "#81c784",
      desc: "AgroLink-এর মাধ্যমে বাজারজাত করা ফসলের মোট পরিমাণ।",
    },
  ];

  return (
    <section
      className="py-5 text-center text-white position-relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #2e7d32, #43a047, #66bb6a)",
      }}
    >
      <motion.div
        className="container"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <motion.h2
          className="fw-bold mb-3 display-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          🌍 Our Sustainable Impact
        </motion.h2>

        <p className="mb-5 text-light fs-5">
          আমরা বিশ্বাস করি প্রযুক্তির মাধ্যমে কৃষিকে শক্তিশালী করা যায়।  
          AgroLink-এর মাধ্যমে আমরা বাংলাদেশের কৃষিক্ষেত্রে নতুন এক বিপ্লব আনছি। 🌾
        </p>

        <Row className="g-4 justify-content-center">
          {metrics.map((m, i) => (
            <Col key={i} xs={12} sm={6} md={3}>
              <motion.div
                className="p-4 rounded shadow-lg bg-white bg-opacity-10 border border-light h-100"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="display-5 mb-2"
                  style={{ color: m.color }}
                  initial={{ rotate: 0 }}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                >
                  {m.icon}
                </motion.div>
                <h2 className="fw-bold mb-0">
                  <Counter end={m.value} duration={2000} />
                </h2>
                <h6 className="fw-semibold text-light mb-2">{m.title}</h6>
                <p className="small text-white-50">{m.desc}</p>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.div>

      {/* 🌿 Floating glow animation */}
      <motion.div
        className="position-absolute bg-light opacity-10 rounded-circle"
        style={{
          width: "250px",
          height: "250px",
          top: "-80px",
          right: "-50px",
          filter: "blur(90px)",
        }}
        animate={{
          y: [0, 20, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="position-absolute bg-success opacity-20 rounded-circle"
        style={{
          width: "200px",
          height: "200px",
          bottom: "-60px",
          left: "-40px",
          filter: "blur(70px)",
        }}
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />
    </section>
  );
}
