import { motion } from "framer-motion";
import { Button } from "react-bootstrap";

export default function CallToActionSection() {
  return (
    <section
      className="py-5 text-center text-white position-relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #2e7d32, #43a047, #66bb6a)",
      }}
    >
      {/* 🌾 Background Animated Gradient Blobs */}
      <motion.div
        className="position-absolute rounded-circle bg-white opacity-25"
        style={{
          width: "200px",
          height: "200px",
          top: "-50px",
          left: "-50px",
          filter: "blur(70px)",
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="position-absolute rounded-circle bg-light opacity-10"
        style={{
          width: "250px",
          height: "250px",
          bottom: "-80px",
          right: "-60px",
          filter: "blur(90px)",
        }}
        animate={{
          x: [0, -60, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 🌱 Main Content */}
      <motion.div
        className="container position-relative"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="fw-bold mb-3 display-5">
          Join the <span className="text-warning">Green Revolution 🌾</span>
        </h2>
        <p className="fs-5 mb-4 text-light">
          AgroLink-এর সাথে যুক্ত হয়ে বাংলাদেশের কৃষিকে ডিজিটাল ও টেকসই ভবিষ্যতের দিকে এগিয়ে নিন।  
          একসাথে গড়ি একটি স্মার্ট কৃষি ইকোসিস্টেম — যেখানে কৃষক, ক্রেতা ও পরিবহনকারীরা সবাই লাভবান 🌱
        </p>

        {/* 🚀 CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          viewport={{ once: true }}
        >
          <Button
            variant="light"
            className="fw-semibold px-4 py-2 shadow-sm border-0"
            style={{
              borderRadius: "50px",
              color: "#2e7d32",
              fontSize: "1.1rem",
            }}
            whileHover={{
              scale: 1.08,
              boxShadow: "0 0 20px rgba(255,255,255,0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            as={motion.button}
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            🚀 Get Started
          </Button>
        </motion.div>
      </motion.div>

      {/* ✨ Floating Leaf Icons Animation */}
      <motion.div
        className="position-absolute text-white fs-1"
        style={{ left: "10%", bottom: "15%" }}
        animate={{
          y: [0, -10, 0],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        🍃
      </motion.div>
      <motion.div
        className="position-absolute text-white fs-1"
        style={{ right: "12%", top: "20%" }}
        animate={{
          y: [0, 15, 0],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        🌿
      </motion.div>
    </section>
  );
}
