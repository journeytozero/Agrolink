import { Carousel } from "react-bootstrap";

export default function HeroCarousel() {
  const slides = [
    {
      img: "https://images.pexels.com/photos/4167144/pexels-photo-4167144.jpeg",
      title: "মাটির ঘ্রাণে ব্যবসা, বিশ্বাসে বিকাশ",
      text: "প্রতিটি পণ্যের পেছনে আছে এক কৃষকের গল্প — আমরা সেই গল্পগুলো পৌঁছে দিচ্ছি সরাসরি আপনার হাতে।",
    },
    {
      img: "https://images.pexels.com/photos/30851832/pexels-photo-30851832.jpeg",
      title: "From Farm to Table — সরাসরি মাঠ থেকে আপনার ঘরে",
      text: "ডিজিটাল প্রযুক্তির মাধ্যমে কৃষক ও ক্রেতার সংযোগ, স্বচ্ছ লেনদেনের নিশ্চয়তা।",
    },
    {
      img: "https://images.pexels.com/photos/30851832/pexels-photo-30851832.jpeg",
      title: "From Farm to Table — সরাসরি মাঠ থেকে আপনার ঘরে",
      text: "ডিজিটাল প্রযুক্তির মাধ্যমে কৃষক ও ক্রেতার সংযোগ, স্বচ্ছ লেনদেনের নিশ্চয়তা।",
    },
    {
      img: "https://images.pexels.com/photos/30851832/pexels-photo-30851832.jpeg",
      title: "From Farm to Table — সরাসরি মাঠ থেকে আপনার ঘরে",
      text: "ডিজিটাল প্রযুক্তির মাধ্যমে কৃষক ও ক্রেতার সংযোগ, স্বচ্ছ লেনদেনের নিশ্চয়তা।",
    }
  ];

  return (
    <Carousel fade interval={3000} pause={false}>
      {slides.map((s, i) => (
        <Carousel.Item key={i}>
          <img
            src={s.img}
            className="d-block w-100"
            style={{ height: "80vh", objectFit: "cover" }}
            alt={s.title}
          />
          <Carousel.Caption className="bg-dark bg-opacity-50 rounded p-3">
            <h2>{s.title}</h2>
            <p>{s.text}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
