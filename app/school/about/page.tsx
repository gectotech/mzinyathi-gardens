"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const heroImages = [
  "/school/school1.jpg",
  "/school/school2.jpg",
  "/school/school3.jpg",
];

export default function AboutPage() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) =>
        prev === heroImages.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="bg-white min-h-screen">

      {/* HERO */}
      <section className="relative min-h-[50svh] sm:min-h-[60svh] lg:min-h-[70svh] max-h-[900px] overflow-hidden">
        {heroImages.map((img, index) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentImage === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={img}
              alt="School Campus"
              fill
              priority
              className="object-cover"
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-[#04194b]/95 via-[#04194b]/75 to-black/40" />

        {/* floating particles */}
        <div className="absolute top-10 left-4 sm:left-20 w-40 sm:w-72 h-40 sm:h-72 rounded-full bg-blue-500/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-4 sm:right-20 w-48 sm:w-96 h-48 sm:h-96 rounded-full bg-red-500/20 blur-3xl animate-pulse" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 h-full min-h-[inherit] flex items-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-3xl text-white"
          >
            <p className="text-red-400 text-xl sm:text-3xl italic mb-4 sm:mb-6">
              About Us
            </p>

            <h1 className="text-display font-black leading-tight mb-4 sm:mb-6">
              Building Future Leaders
              <br />
              With Values & Vision
            </h1>

            <p className="text-body-lg text-gray-200 leading-relaxed">
              Discover the story, mission and values that make
              Mzinyathi Gardens Primary School a place of excellence,
              innovation and lifelong learning.
            </p>
          </motion.div>
        </div>

        {/* wave */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg
            viewBox="0 0 1440 170"
            className="w-full"
            fill="white"
          >
            <path d="M0,64L80,80C160,96,320,128,480,122.7C640,117,800,75,960,69.3C1120,64,1280,96,1360,112L1440,128V320H0Z" />
          </svg>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Image
              src="/school/school1.jpg"
              alt="School"
              width={700}
              height={500}
              className="rounded-3xl shadow-2xl"
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-24 h-24 rounded-full bg-red-600 text-white text-4xl shadow-2xl hover:scale-110 transition">
                ▶
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-red-600 font-bold uppercase mb-3">
              Our Story
            </p>

            <h2 className="text-5xl font-black text-[#04194b] mb-8">
              A Legacy of Excellence
              <br />
              Since Our Beginning
            </h2>

            <p className="text-gray-700 text-lg leading-8 mb-6">
              Mzinyathi Gardens Primary School is a new independent
              school opening in 2027 with a vision to provide
              world-class education grounded in discipline,
              leadership, innovation and academic excellence.
            </p>

            <p className="text-gray-700 text-lg leading-8">
              Our goal is to nurture confident, responsible and
              future-ready learners equipped to thrive in an
              ever-changing world while maintaining strong values and
              character.
            </p>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">

          <div className="grid md:grid-cols-4 gap-6">

            {[
              {
                number: "2027",
                title: "Opening Year",
              },
              {
                number: "1000+",
                title: "Future Learners",
              },
              {
                number: "50+",
                title: "Qualified Staff",
              },
              {
                number: "98%",
                title: "Target Success Rate",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                whileHover={{
                  scale: 1.05,
                  y: -8,
                }}
                className="bg-white rounded-2xl shadow-lg border p-8 text-center"
              >
                <h3 className="text-5xl font-black text-[#04194b] mb-3">
                  {item.number}
                </h3>

                <p className="font-semibold text-gray-700">
                  {item.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">

          <div className="bg-[#04194b] rounded-[30px] overflow-hidden">

            <div className="grid lg:grid-cols-3 items-center">

              {/* Vision */}
              <div className="p-10 bg-white h-full">

                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl mb-6">
                  👁
                </div>

                <h3 className="text-3xl font-bold text-[#04194b] mb-4">
                  Our Vision
                </h3>

                <p className="text-gray-600 leading-8">
                  To become Zimbabwe's leading primary school
                  that inspires a passion for learning and
                  prepares every child for a successful future.
                </p>
              </div>

              {/* Logo Center */}
              <div className="relative flex items-center justify-center py-14">

                <div className="absolute w-80 h-80 bg-blue-500/30 rounded-full blur-3xl" />

                <Image
                  src="/school/slo.png"
                  alt="School Logo"
                  width={260}
                  height={260}
                  className="relative z-10"
                />
              </div>

              {/* Mission */}
              <div className="p-10 bg-white h-full">

                <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white text-3xl mb-6">
                  🎯
                </div>

                <h3 className="text-3xl font-bold text-[#04194b] mb-4">
                  Our Mission
                </h3>

                <p className="text-gray-600 leading-8">
                  To provide quality education in a safe,
                  caring and innovative learning environment
                  that develops confident, responsible and
                  productive citizens.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* CORE VALUES */}
      <section className="pb-24">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">

            <p className="text-red-600 font-bold uppercase tracking-wider mb-4">
              Our Values
            </p>

            <h2 className="text-5xl font-black text-[#04194b]">
              Our Core Values
            </h2>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">

            {[
              {
                icon: "🤝",
                title: "Respect",
                desc: "Treat everyone with dignity and kindness.",
              },
              {
                icon: "🛡",
                title: "Integrity",
                desc: "Doing what is right at all times.",
              },
              {
                icon: "⭐",
                title: "Excellence",
                desc: "Striving for the highest standards.",
              },
              {
                icon: "❤️",
                title: "Compassion",
                desc: "Showing care and empathy.",
              },
              {
                icon: "👥",
                title: "Teamwork",
                desc: "Achieving together.",
              },
              {
                icon: "📍",
                title: "Discipline",
                desc: "Self-control and responsibility.",
              },
            ].map((value) => (
              <motion.div
                key={value.title}
                whileHover={{
                  y: -10,
                  scale: 1.03,
                }}
                className="bg-white rounded-2xl border shadow-md p-6 text-center"
              >
                <div className="text-4xl mb-4">
                  {value.icon}
                </div>

                <h3 className="font-bold text-[#04194b] mb-3">
                  {value.title}
                </h3>

                <p className="text-sm text-gray-600 leading-6">
                  {value.desc}
                </p>
              </motion.div>
            ))}

          </div>

        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative py-24 overflow-hidden">

        <div className="absolute inset-0">
          <Image
            src="/school/school2.jpg"
            alt="Students"
            fill
            className="object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-[#04194b]/90" />

        {/* Glow Effects */}
        <div className="absolute top-10 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-20 w-72 h-72 bg-red-500/20 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 max-w-6xl mx-auto px-6">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >

            <p className="text-red-400 font-bold uppercase tracking-widest mb-4">
              Admissions Open
            </p>

            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Join Us In Building
              <br />
              Future Leaders
            </h2>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-8">
              Mzinyathi Gardens Primary School opens its doors in
              2027. Secure your child's place today and become part
              of a new generation of excellence, leadership and
              innovation.
            </p>

          </motion.div>

        </div>
      </section>

    </main>
  );
}