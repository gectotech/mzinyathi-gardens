"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Newspaper,
  GraduationCap,
  Building2,
  Users,
  ArrowRight,
  Calendar,
  Bell,
  Sparkles,
  Megaphone,
} from "lucide-react";

export default function NewsPage() {
  const latestNews = [
    {
      title: "New Classroom Block Construction Update",
      image: "/school/school1.jpg",
      date: "20 May 2026",
      category: "Development",
      icon: Building2,
      description:
        "Construction of our modern classroom block continues as we prepare for opening in 2027.",
    },
    {
      title: "Curriculum Planning Underway",
      image: "/school/student.jpg",
      date: "18 May 2026",
      category: "Academics",
      icon: GraduationCap,
      description:
        "Our academic team is preparing a world-class curriculum for learners.",
    },
    {
      title: "Community Engagement Meeting",
      image: "/school/school2.jpg",
      date: "15 May 2026",
      category: "Events",
      icon: Users,
      description:
        "Parents and stakeholders joined discussions about the school's future.",
    },
    {
      title: "Sports Facilities Development",
      image: "/school/sport.jpg",
      date: "10 May 2026",
      category: "Development",
      icon: Building2,
      description:
        "Construction of sports facilities is progressing well for 2027.",
    },
  ];

  return (
    <main className="bg-slate-50 overflow-hidden">

      {/* HERO */}

      <section className="relative h-[650px] flex items-center">

        <div className="absolute inset-0">

          <Image
            src="/school/dev.jpg"
            alt=""
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#00154d]/95 via-[#00154d]/80 to-[#00154d]/40" />
        </div>

        {/* floating circles */}

        <div className="absolute top-24 left-20 w-32 h-32 border border-red-400 rounded-full animate-pulse" />

        <div className="absolute bottom-32 right-40 w-20 h-20 border border-yellow-400 rounded-full animate-bounce" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">

          <div className="grid lg:grid-cols-2 gap-10 items-center">

            <div>

              <p className="text-red-400 text-2xl italic mb-5">
                Stay Connected
              </p>

              <h1 className="text-6xl font-black text-white leading-tight mb-6">
                News & Updates
              </h1>

              <p className="text-white/90 text-xl leading-relaxed max-w-xl">
                Stay informed about school development, admissions,
                recruitment and exciting milestones as we prepare
                to officially open our doors in 2027.
              </p>
            </div>

            <div className="relative h-[450px]">

              <Image
                src="/school/school2.jpg"
                alt=""
                fill
                className="object-cover rounded-[40px]"
              />

              <div className="absolute -top-10 -right-10 w-40 h-40 border-4 border-red-500 rounded-full animate-spin" />

              <div className="absolute -bottom-10 left-10 w-24 h-24 bg-yellow-400 rounded-full blur-3xl opacity-50" />
            </div>

          </div>
        </div>

        {/* wave */}

        <div className="absolute bottom-0 left-0 w-full">
          <svg
            viewBox="0 0 1440 220"
            className="w-full fill-slate-50"
          >
            <path d="M0,128L80,138.7C160,149,320,171,480,170.7C640,171,800,149,960,133.3C1120,117,1280,107,1360,101.3L1440,96L1440,320L0,320Z" />
          </svg>
        </div>

      </section>

      {/* FEATURED NEWS */}

      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">

        <div className="grid lg:grid-cols-[2fr_1fr] gap-8">

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

            <div className="grid lg:grid-cols-2">

              <div className="p-10">

                <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                  FEATURED
                </span>

                <h2 className="text-4xl font-black text-slate-900 mt-6 mb-4">
                  Mzinyathi Gardens Primary School Development Progress
                </h2>

                <p className="text-slate-600 leading-relaxed mb-8">
                  Construction continues at an exciting pace as we
                  prepare to officially welcome learners in January
                  2027. New classroom blocks, administration offices,
                  sports facilities and learning spaces are taking shape.
                </p>

                <Link
                  href="/school/news/development-progress"
                  className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-red-700 transition"
                >
                  Read Full Update
                  <ArrowRight size={18} />
                </Link>

              </div>

              <div className="relative min-h-[400px]">

                <Image
                  src="/school/schooldev.jpg"
                  alt=""
                  fill
                  className="object-cover"
                />

              </div>

            </div>
          </div>

          {/* QUICK UPDATES */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <h3 className="text-2xl font-black text-slate-900 mb-8">
              Quick Updates
            </h3>

            <div className="space-y-6">

              <div className="flex gap-4 items-start">
                <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                  <Newspaper className="text-green-600" size={24} />
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">
                    Admissions Open
                  </h4>

                  <p className="text-slate-500 text-sm">
                    Applications for 2027 are now being accepted.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-14 h-14 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <Users className="text-yellow-600" size={24} />
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">
                    Staff Recruitment
                  </h4>

                  <p className="text-slate-500 text-sm">
                    Teachers, Principal, Cleaners and more.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Building2 className="text-blue-600" size={24} />
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">
                    Construction Progress
                  </h4>

                  <p className="text-slate-500 text-sm">
                    Major infrastructure milestones achieved.
                  </p>
                </div>
              </div>

            </div>

            <Link
              href="/school/admissions"
              className="mt-8 block text-center bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold transition"
            >
              Apply For Admission
            </Link>

          </div>

        </div>
      </section>

      {/* LATEST NEWS */}

      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="text-center mb-14">

          <h2 className="text-5xl font-black text-slate-900">
            Latest News
          </h2>

          <p className="text-slate-500 mt-4">
            Follow our journey toward opening in January 2027
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {latestNews.map((item, index) => {
            const Icon = item.icon;

            return (
              <article
                key={index}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
              >
                <div className="relative h-60">

                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />

                </div>

                <div className="p-6">

                  <div className="flex items-center gap-2 mb-4">

                    <Icon size={16} className="text-red-600" />

                    <span className="text-red-600 text-sm font-bold">
                      {item.category}
                    </span>

                  </div>

                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                    <Calendar size={14} />
                    {item.date}
                  </div>

                  <h3 className="font-black text-xl text-slate-900 mb-3">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.description}
                  </p>

                </div>
              </article>
            );
          })}

        </div>

      </section>

      {/* SCHOOL ACTIVITIES */}

      <section className="bg-white py-24">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-14">

            <h2 className="text-5xl font-black text-slate-900">
              School Activities
            </h2>

            <p className="text-slate-500 mt-4">
              Beyond academics, we nurture talent and character.
            </p>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">

            {[
              {
                image: "/school/sport.jpg",
                title: "Sports",
                text: "Football, athletics, netball and more."
              },
              {
                image: "/school/club.jpg",
                title: "Clubs",
                text: "STEM, Debate, Chess and leadership clubs."
              },
              {
                image: "/school/culture.jpg",
                title: "Culture",
                text: "Celebrating diversity and heritage."
              },
              {
                image: "/school/tour.jpg",
                title: "Tours",
                text: "Educational trips and excursions."
              },
              {
                image: "/school/art.jpg",
                title: "Arts",
                text: "Creativity through visual and performing arts."
              },
            ].map((activity, i) => (
              <div
                key={i}
                className="bg-slate-50 rounded-3xl overflow-hidden hover:shadow-xl transition"
              >
                <div className="relative h-52">

                  <Image
                    src={activity.image}
                    alt={activity.title}
                    fill
                    className="object-cover"
                  />

                </div>

                <div className="p-5 text-center">

                  <h3 className="font-black text-lg text-slate-900 mb-2">
                    {activity.title}
                  </h3>

                  <p className="text-slate-600 text-sm">
                    {activity.text}
                  </p>

                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* NEWSLETTER */}

      <section className="pb-24 px-6">

        <div className="max-w-7xl mx-auto">

          <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-[#00154d] via-[#002b7f] to-[#00154d]">

            <div className="absolute inset-0 opacity-20">
              <Image
                src="/school/student.jpg"
                alt=""
                fill
                className="object-cover"
              />
            </div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center p-12 lg:p-16">

              <div>

                <div className="flex items-center gap-4 mb-6">

                  <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
                    <Bell className="text-white" size={28} />
                  </div>

                  <div>
                    <h2 className="text-4xl font-black text-white">
                      Never Miss An Update
                    </h2>

                    <p className="text-white/80">
                      Stay informed as we prepare for opening in 2027.
                    </p>
                  </div>

                </div>

                <div className="flex flex-col md:flex-row gap-4">

                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 px-5 py-4 rounded-xl outline-none"
                  />

                  <button className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl transition">
                    Subscribe
                  </button>

                </div>

              </div>

              <div className="relative h-[250px]">

                <Image
                  src="/school/student.jpg"
                  alt=""
                  fill
                  className="object-contain"
                />

              </div>

            </div>

            {/* Decorative Elements */}

            <div className="absolute top-8 right-20 animate-bounce">
              <Sparkles className="text-yellow-400" size={40} />
            </div>

            <div className="absolute bottom-10 left-20 animate-pulse">
              <Megaphone className="text-red-400" size={40} />
            </div>

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="pb-24 px-6">

        <div className="max-w-7xl mx-auto">

          <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 rounded-[40px] p-12 text-center text-white relative overflow-hidden">

            <div className="absolute -top-20 -left-20 w-60 h-60 bg-white/10 rounded-full" />

            <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-white/10 rounded-full" />

            <h2 className="text-5xl font-black mb-6">
              Admissions For 2027 Are Open
            </h2>

            <p className="text-xl max-w-3xl mx-auto mb-10 text-white/90">
              Be among the first families to join Mzinyathi Gardens
              Primary School as we open our doors in January 2027.
            </p>

            <Link
              href="/school/admissions"
              className="inline-flex items-center gap-3 bg-white text-red-600 px-10 py-5 rounded-xl font-black text-lg hover:scale-105 transition"
            >
              Apply For Admission
              <ArrowRight size={22} />
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}