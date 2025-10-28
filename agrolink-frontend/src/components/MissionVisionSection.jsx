import { motion } from "framer-motion";

export default function MissionVisionSection() {
  return (
    <section className="py-5" style={{ background: "linear-gradient(135deg, #f5fff7 0%, #ffffff 100%)" }}>
      <div className="container">
        {/* 🌱 Mission Section */}
        <motion.div
          className="row align-items-center mb-5"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="col-md-6 order-md-2 text-center mb-4 mb-md-0">
            <motion.img
              src="https://images.pexels.com/photos/6715987/pexels-photo-6715987.jpeg"
              alt="Our Mission"
              className="img-fluid rounded shadow-lg"
              style={{ maxHeight: "350px", objectFit: "cover" }}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            />
          </div>
          <div className="col-md-6 order-md-1">
            <motion.h2
              className="fw-bold text-success mb-3"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              🌱 Our Mission
            </motion.h2>
            <motion.p
              className="text-muted fs-5"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
            >
              আমাদের লক্ষ্য হচ্ছে কৃষকদের ক্ষমতায়ন করা এবং কৃষি খাতে স্বচ্ছতা আনা।  
              <strong>AgroLink</strong> কৃষক, ক্রেতা ও পরিবহনকারীদের একত্রিত করে  
              একটি স্মার্ট ও ডিজিটাল কৃষি ইকোসিস্টেম তৈরি করছে,  
              যেখানে প্রতিটি ফসলের প্রকৃত মূল্য কৃষকের হাতে পৌঁছে।
            </motion.p>
            <motion.p
              className="text-muted fs-5"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
            >
              আমরা বিশ্বাস করি — প্রযুক্তির ব্যবহারই বাংলাদেশের কৃষিকে  
              আরও লাভজনক, টেকসই এবং আধুনিক করে তুলতে পারে 🌾
            </motion.p>
          </div>
        </motion.div>

        {/* 🌍 Vision Section */}
        <motion.div
          className="row align-items-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="col-md-6 text-center mb-4 mb-md-0">
            <motion.img
              src="https://images.pexels.com/photos/29630103/pexels-photo-29630103.jpeg"
              alt="Our Vision"
              className="img-fluid rounded shadow-lg"
              style={{ maxHeight: "350px", objectFit: "cover" }}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            />
          </div>
          <div className="col-md-6">
            <motion.h2
              className="fw-bold text-success mb-3"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              🌍 Our Vision
            </motion.h2>
            <motion.p
              className="text-muted fs-5"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
            >
              আমাদের ভিশন হলো একটি ন্যায্য ও স্বচ্ছ কৃষি চেইন গঠন করা  
              — যেখানে প্রতিটি কৃষক তার ফসলের প্রকৃত মূল্য পাবে  
              এবং ক্রেতা পাবে সরাসরি মাঠের খাঁটি পণ্য।
            </motion.p>
            <motion.p
              className="text-muted fs-5"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
            >
              AgroLink এমন একটি বাংলাদেশ গড়ার স্বপ্ন দেখে,  
              যেখানে কৃষি হবে সম্মানের পেশা,  
              আর কৃষক হবে ডিজিটাল যুগের নায়ক। 🌿
            </motion.p>
            <motion.button
              className="btn btn-success mt-3 shadow-sm px-4 py-2 fw-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: "smooth",
                })
              }
            >
              Learn More →
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
