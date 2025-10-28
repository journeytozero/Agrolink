import { useEffect, useState } from "react";
import api from "../api";
import NavbarH from "../components/NavbarH";
import HeroCarousel from "../components/HeroCarousel";
import ProductFilter from "../components/ProductFilter";
import WhyChooseSection from "../components/WhyChooseSection";
// import AboutUsSection from "../components/AboutUsSection";
import Footer from "../components/Footer";
import MissionVisionSection from "../components/MissionVisionSection";
import TestimonialsSection from "../components/TestimonialsSection";
import CallToActionSection from "../components/CallToActionSection";
import PartnersSection from "../components/PartnersSection";
import ImpactMetricsSection from "../components/ImpactMetricsSection";






export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    api.get("/products")
      .then((res) => setProducts(res.data))
      .catch(() => console.warn("⚠️ Failed to load products"));
  }, []);

  const handleAddToCart = (product) => {
    const updated = [...cart, product];
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    alert(`✅ ${product.name} added to cart!`);
  };

  return (
    <>
      <NavbarH cartCount={cart.length} />
      <HeroCarousel />
      <ProductFilter products={products} onAddToCart={handleAddToCart} />
      <WhyChooseSection />
      <MissionVisionSection />
      <TestimonialsSection />
      <CallToActionSection />
      <PartnersSection />
      <ImpactMetricsSection />
      {/* <AboutUsSection /> */}
      <Footer />
    </>
  );
}
