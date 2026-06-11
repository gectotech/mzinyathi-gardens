"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const heroImages = [
  "/school/sport.jpg",
  "/school/culture.jpg",
  "/school/tour.jpg",
];

const offerings = [
  {
    title: "Academic Excellence",
    image: "/school/school1.jpg",
    description:
      "A strong curriculum focused on literacy, numeracy, sciences, technology and lifelong learning.",
  },
  {
    title: "Sports Development",
    image: "/school/sport.jpg",
    description:
      "Football, athletics, physical education and activities that promote teamwork and discipline.",
  },
  {
    title: "Arts & Creativity",
    image: "/school/art.jpg",
    description:
      "Music, visual arts, drama and creative expression programs that unlock learner potential.",
  },
  {
    title: "Cultural Activities",
    image: "/school/culture.jpg",
    description:
      "Celebrating diversity, heritage and cultural awareness through engaging school events.",
  },
  {
    title: "Educational Tours",
    image: "/school/tour.jpg",
    description:
      "Learning beyond the classroom through educational visits and experiential activities.",
  },
  {
    title: "Clubs & Leadership",
    image: "/school/club.jpg",
    description:
      "Leadership clubs and learner development programs that build confidence and responsibility.",
  },
];

export default function WhatWeOfferPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === heroImages.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="bg-white min-h-screen">

      {/* HERO */}

      <section className="relative h-[85vh] overflow-hidden">

        {heroImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-all duration-1000 ${
              currentSlide === index
                ? "opacity-100 scale-100"
                : "opacity-0 scale-110"
            }`}
          >
            <Image
              src={image}
              alt=""
              fill
              className="object-cover"
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-black/65" />

        <div className="relative z-10 h-full flex items-center">

          <div className="max-w-7xl mx-auto px-6">

            <div className="max-w-3xl">

              <p className="text-red-500 font-bold uppercase tracking-[4px] mb-5">
                What We Offer
              </p>

              <h1 className="text-white text-5xl md:text-7xl font-black leading-tight mb-6">
                Inspiring Excellence
                <br />
                Beyond The Classroom
              </h1>

              <p className="text-gray-200 text-xl leading-8">
                At Mzinyathi Gardens Primary School, we provide a
                balanced education that nurtures academic achievement,
                creativity, leadership, character and innovation.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* OFFERINGS SECTION */}

      <section className="py-24 bg-gray-50">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">

            <p className="text-red-600 font-bold uppercase tracking-[3px] mb-3">
              Our Programs
            </p>

            <h2 className="text-4xl md:text-5xl font-black text-[#04194b] mb-4">
              A Well-Rounded Education
            </h2>

            <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full" />

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {offerings.map((item) => (
              <div
                key={item.title}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-500"
              >

                <div className="relative h-64 overflow-hidden">

                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                </div>

                <div className="p-8">

                  <h3 className="text-2xl font-bold text-[#04194b] mb-4">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 leading-8">
                    {item.description}
                  </p>

                </div>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* SCHOOL ACTIVITIES */}

      <section className="py-24 bg-white">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">

            <p className="text-red-600 font-bold uppercase tracking-[3px] mb-3">
              School Activities
            </p>

            <h2 className="text-4xl md:text-5xl font-black text-[#04194b]">
              Learning Beyond The Classroom
            </h2>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">

            {/* SPORT */}

            <div className="rounded-3xl overflow-hidden shadow-lg bg-white">

              <div className="relative h-56">
                <Image
                  src="/school/sport.jpg"
                  alt="Sports"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-5">
                <h3 className="font-bold text-[#04194b] mb-2">
                  Sports
                </h3>

                <p className="text-sm text-gray-600 leading-7">
                  Building teamwork, discipline, fitness and confidence
                  through sporting activities.
                </p>
              </div>

            </div>

            {/* CLUBS */}

            <div className="rounded-3xl overflow-hidden shadow-lg bg-white">

              <div className="relative h-56">
                <Image
                  src="/school/club.jpg"
                  alt="Clubs"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-5">
                <h3 className="font-bold text-[#04194b] mb-2">
                  Clubs
                </h3>

                <p className="text-sm text-gray-600 leading-7">
                  Encouraging leadership, innovation and collaboration
                  through learner clubs.
                </p>
              </div>

            </div>

            {/* CULTURE */}

            <div className="rounded-3xl overflow-hidden shadow-lg bg-white">

              <div className="relative h-56">
                <Image
                  src="/school/culture.jpg"
                  alt="Culture"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-5">
                <h3 className="font-bold text-[#04194b] mb-2">
                  Cultural Activities
                </h3>

                <p className="text-sm text-gray-600 leading-7">
                  Celebrating heritage, diversity and cultural identity.
                </p>
              </div>

            </div>

            {/* TOURS */}

            <div className="rounded-3xl overflow-hidden shadow-lg bg-white">

              <div className="relative h-56">
                <Image
                  src="/school/tour.jpg"
                  alt="Tours"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-5">
                <h3 className="font-bold text-[#04194b] mb-2">
                  Educational Tours
                </h3>

                <p className="text-sm text-gray-600 leading-7">
                  Exploring real-world learning experiences outside the classroom.
                </p>
              </div>

            </div>

            {/* ARTS */}

            <div className="rounded-3xl overflow-hidden shadow-lg bg-white">

              <div className="relative h-56">
                <Image
                  src="/school/art.jpg"
                  alt="Arts"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-5">
                <h3 className="font-bold text-[#04194b] mb-2">
                  Arts & Creativity
                </h3>

                <p className="text-sm text-gray-600 leading-7">
                  Unlocking creativity through music, drama, art and expression.
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ENROLL YOUR CHILD CTA */}

      <section className="relative py-24 overflow-hidden">

        <div className="absolute inset-0">
          <Image
            src="/school/student.jpg"
            alt="Students"
            fill
            className="object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-[#04194b]/85" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">

          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div>

              <p className="text-yellow-400 font-bold uppercase tracking-[3px] mb-4">
                Admissions Open For 2027
              </p>

              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                Enroll Your Child
                <br />
                Today
              </h2>

              <p className="text-gray-300 text-lg leading-8 mb-8">
                Mzinyathi Gardens Primary School will officially open in
                2027. We are now accepting applications from ECD to Grade 7.
                Join a new generation of excellence, innovation and character
                development.
              </p>

              <Link
                href="/school/admissions"
                className="inline-flex items-center gap-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-xl transition"
              >
                Apply For Admission
                <span>→</span>
              </Link>

            </div>

            <div className="bg-white rounded-3xl p-10 shadow-2xl">

              <h3 className="text-3xl font-black text-[#04194b] mb-6">
                Why Choose Us?
              </h3>

              <div className="space-y-5">

                <div className="flex gap-4">
                  <div className="w-3 h-3 bg-red-600 rounded-full mt-2" />
                  <p className="text-gray-700">
                    Modern learning environment designed for academic success.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="w-3 h-3 bg-red-600 rounded-full mt-2" />
                  <p className="text-gray-700">
                    Qualified educators committed to learner growth.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="w-3 h-3 bg-red-600 rounded-full mt-2" />
                  <p className="text-gray-700">
                    Strong focus on leadership, discipline and character.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="w-3 h-3 bg-red-600 rounded-full mt-2" />
                  <p className="text-gray-700">
                    Sports, clubs, arts and cultural activities.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="w-3 h-3 bg-red-600 rounded-full mt-2" />
                  <p className="text-gray-700">
                    Technology-driven education preparing learners for the future.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


    </main>
  );
}