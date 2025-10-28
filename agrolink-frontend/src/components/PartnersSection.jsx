import { motion } from "framer-motion";
import { Row, Col } from "react-bootstrap";

export default function PartnersSection() {
  const partners = [
    {
      name: "BRAC Agriculture",
      logo: "https://upload.wikimedia.org/wikipedia/en/1/12/BRAC_Logo.svg",
      desc: "Bangladesh’s leading NGO working with AgroLink to support rural farmers with training and fair trade.",
    },
    {
      name: "Ministry of Agriculture",
      logo: "https://upload.wikimedia.org/wikipedia/en/f/fb/Ministry_of_Agriculture_Logo_Bangladesh.svg",
      desc: "Partnering to digitize the agricultural supply chain and connect farmers directly with national markets.",
    },
    {
      name: "USAID Bangladesh",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/USAID-Identity.svg",
      desc: "Supporting AgroLink’s mission to build sustainable, tech-driven farming communities across Bangladesh.",
    },
    {
      name: "FAO",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/FAO_logo.svg",
      desc: "Collaborating for food security and digital agriculture initiatives in South Asia.",
    },
  ];

  return (
    <section
      className="py-5"
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #e9f7ef 100%)",
      }}
    >
      <div className="container text-center">
        {/* 🌿 Section Header */}
        <motion.h2
          className="fw-bold text-success mb-3"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          🤝 Our Partners & Collaborations
        </motion.h2>
        <motion.p
          className="text-muted mb-5 fs-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Together with NGOs, Government bodies & Global Organizations,  
          <strong>AgroLink</strong> is transforming agriculture into a sustainable,  
          transparent, and tech-driven ecosystem.
        </motion.p>

        {/* 🌍 Partner Logos Grid */}
        <Row className="g-4 justify-content-center">
          {partners.map((p, i) => (
            <Col key={i} xs={12} sm={6} md={3} className="text-center">
              <motion.div
                className="p-4 bg-white rounded shadow-sm h-100 border partner-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={p.logo}
                  alt={p.name}
                  className="img-fluid mb-3"
                  style={{ height: "60px", objectFit: "contain" }}
                />
                <h6 className="fw-bold text-success">{p.name}</h6>
                <p className="small text-muted">{p.desc}</p>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* 🌾 Animated Divider Line */}
        <motion.div
          className="mt-5"
          initial={{ width: 0 }}
          whileInView={{ width: "80%" }}
          transition={{ duration: 1 }}
          style={{
            height: "3px",
            background: "linear-gradient(90deg, #43a047, #81c784, #a5d6a7)",
            margin: "0 auto",
            borderRadius: "2px",
          }}
        />
      </div>

      {/* 🌿 Custom Hover Style */}
      <style>{`
        .partner-card {
          transition: all 0.3s ease;
        }
        .partner-card:hover {
          box-shadow: 0 10px 25px rgba(0, 128, 0, 0.15);
          border-color: #4caf50 !important;
        }
      `}</style>
    </section>
  );
}
