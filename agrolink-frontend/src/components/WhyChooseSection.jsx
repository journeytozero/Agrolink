import { motion } from "framer-motion";
import { Row, Col } from "react-bootstrap";

export default function WhyChooseSection() {
  const data = [
    {
      icon: "🚜",
      title: "Empowering Farmers",
      text: "কৃষকদের ন্যায্য মূল্য নিশ্চিত করে, তাদের সরাসরি বাজারের সাথে যুক্ত করছি।",
    },
    {
      icon: "💼",
      title: "Smart Marketplace",
      text: "একটি ডিজিটাল প্ল্যাটফর্ম যেখানে ক্রেতা, কৃষক ও পরিবহনকারীরা যুক্ত।",
    },
    {
      icon: "🌱",
      title: "Sustainable Growth",
      text: "টেকসই কৃষি ও প্রযুক্তিনির্ভর বাংলাদেশের দিকে এক ধাপ এগিয়ে।",
    },
  ];

  return (
    <section className="py-5 bg-light text-center">
      <div className="container">
        <motion.h2
          className="fw-bold text-success mb-5"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          🌟 Why Choose <span className="text-success">AgroLink</span>?
        </motion.h2>

        <Row className="g-4">
          {data.map((item, i) => (
            <Col key={i} md={4}>
              <motion.div
                className="p-4 bg-white rounded shadow-sm h-100"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <h1>{item.icon}</h1>
                <h5 className="fw-bold text-success">{item.title}</h5>
                <p className="text-muted">{item.text}</p>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}
