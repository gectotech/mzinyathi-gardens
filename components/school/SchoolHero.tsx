"use client";

import { useEffect, useState } from "react";

const slides = [
  "/images/school1.jpg",
  "/images/school2.jpg",
  "/images/school3.jpg",
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-[85vh] min-h-[650px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            current === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide}
            alt={`School Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#001b5e]/90 via-[#001b5e]/60 to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Mzinyathi Gardens
              <br />
              Primary School
            </h1>

            <h2 className="text-yellow-400 text-3xl md:text-5xl font-bold mt-6">
              Kusinwa Kudedelwana
            </h2>

            <p className="text-xl mt-6 text-gray-100">
              Nurturing Excellence, Character and Lifelong Learning.
            </p>

            <p className="mt-6 text-lg text-gray-200 max-w-xl">
              Welcome to Mzinyathi Gardens Primary School where every child is
              inspired, valued and empowered to reach their full potential.
            </p>

            <div className="flex gap-4 mt-10 flex-wrap">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded">
                Admissions Open →
              </button>

              <button className="border border-white hover:bg-white hover:text-black px-8 py-4 rounded transition">
                Learn More →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bottom Right */}
      <div className="absolute bottom-10 right-10 z-30 flex items-center gap-4">
        <span className="text-white font-medium">
          {current + 1} / {slides.length}
        </span>

        <button
          onClick={prevSlide}
          className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200"
        >
          ←
        </button>

        <button
          onClick={nextSlide}
          className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200"
        >
          →
        </button>
      </div>
    </section>
  );
}