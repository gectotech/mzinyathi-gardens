"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
  Phone,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Users,
  Clock,
  Send,
  FileText,
  Building2,
  ChevronRight,
} from "lucide-react";

export default function ContactPage() {
  const targetDate = new Date("2027-01-15T00:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) /
              (1000 * 60 * 60)
          ),
          minutes: Math.floor(
            (difference % (1000 * 60 * 60)) /
              (1000 * 60)
          ),
          seconds: Math.floor(
            (difference % (1000 * 60)) / 1000
          ),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <main className="bg-white overflow-hidden">

      {/* HERO */}

      <section className="relative h-[90vh] flex items-center">

        <div className="absolute inset-0">

          <Image
            src="/school/tour.jpg"
            alt=""
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/65" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full">

          <div className="max-w-4xl">

            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-lg text-white px-5 py-2 rounded-full mb-8">

              <Phone size={18} />

              Contact & Admissions
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">

              Let's Build The Future Together

            </h1>

            <p className="mt-8 text-xl text-white/90 max-w-2xl">

              Mzinyathi Elite Primary School opens in
              2027. Enrol your child today or apply
              for available employment opportunities.

            </p>

            <div className="mt-10 flex flex-wrap gap-5">

              <a
                href="#admissions"
                className="bg-[#c1242b] hover:scale-105 transition text-white px-8 py-4 rounded-xl font-bold"
              >
                Apply For Admission
              </a>

              <a
                href="#jobs"
                className="bg-[#2654a7] hover:scale-105 transition text-white px-8 py-4 rounded-xl font-bold"
              >
                Apply For Jobs
              </a>

            </div>
          </div>
        </div>
      </section>

      {/* COUNTDOWN */}

      <section className="py-20 bg-white">

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center">

            <h2 className="text-4xl font-black text-[#2654a7]">

              School Opens In 2027

            </h2>

            <p className="mt-4 text-lg text-black">

              Countdown to our official opening day.
            </p>

          </div>

          <div className="grid md:grid-cols-4 gap-6 mt-12">

            {[
              ["Days", timeLeft.days],
              ["Hours", timeLeft.hours],
              ["Minutes", timeLeft.minutes],
              ["Seconds", timeLeft.seconds],
            ].map(([label, value]) => (
              <div
                key={label}
                className="bg-gradient-to-br from-[#2654a7] to-[#c1242b]
                text-white rounded-3xl p-8 text-center
                hover:-translate-y-3 transition duration-500"
              >
                <div className="text-5xl font-black">
                  {value}
                </div>

                <div className="mt-3 text-xl">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CONTACT INFORMATION */}

      <section className="py-24 bg-gray-50">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-white rounded-3xl p-8 shadow-xl hover:-translate-y-3 transition duration-500">

              <div className="w-16 h-16 rounded-2xl bg-[#2654a7] text-white flex items-center justify-center mb-6">
                <Phone size={30} />
              </div>

              <h3 className="text-2xl font-black text-black">
                Call Us
              </h3>

              <p className="mt-4 text-lg text-black">
                +263 77 620 3372
              </p>

            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl hover:-translate-y-3 transition duration-500">

              <div className="w-16 h-16 rounded-2xl bg-[#c1242b] text-white flex items-center justify-center mb-6">
                <Mail size={30} />
              </div>

              <h3 className="text-2xl font-black text-black">
                Email Us
              </h3>

              <p className="mt-4 text-lg text-black break-all">
                admissions@mzinyathigardens.co.zw
              </p>

            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl hover:-translate-y-3 transition duration-500">

              <div className="w-16 h-16 rounded-2xl bg-[#2654a7] text-white flex items-center justify-center mb-6">
                <MapPin size={30} />
              </div>

              <h3 className="text-2xl font-black text-black">
                Visit Us
              </h3>

              <p className="mt-4 text-lg text-black">
                Plot 1179, Harold Road,
                Kensington, Bulawayo
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* IMAGE + LOCATION */}

      <section className="py-24 bg-white">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div className="relative">

              <div
                className="
                absolute
                -inset-6
                bg-gradient-to-r
                from-[#2654a7]
                to-[#c1242b]
                rounded-[40px]
                blur-2xl
                opacity-30
                "
              />

              <Image
                src="/school/teach.png"
                alt="Teaching Team"
                width={800}
                height={800}
                className="
                relative
                z-10
                w-full
                h-auto
                object-contain
                animate-pulse
                "
              />

            </div>

            <div>

              <div className="inline-flex items-center gap-2 bg-[#2654a7]/10 text-[#2654a7] px-4 py-2 rounded-full mb-6">

                <Building2 size={18} />

                School Location

              </div>

              <h2 className="text-5xl font-black text-black">

                A New Educational Landmark
                For Bulawayo

              </h2>

              <p className="mt-6 text-lg text-black leading-relaxed">

                Mzinyathi Elite Primary School is
                being developed in Kensington,
                Bulawayo to provide world-class
                education, modern facilities and
                a nurturing learning environment
                for future leaders.

              </p>

              <div className="mt-8 bg-gray-100 rounded-3xl p-8">

                <div className="flex gap-4">

                  <MapPin
                    size={26}
                    className="text-[#c1242b]"
                  />

                  <div>

                    <h3 className="font-black text-black text-xl">
                      Location
                    </h3>

                    <p className="text-black mt-2">
                      Plot 1179, Harold Road,
                      Kensington, Bulawayo
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ADMISSIONS FORM */}

      <section
        id="admissions"
        className="py-24 bg-gray-50"
      >

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">

            <div className="inline-flex items-center gap-2 bg-[#c1242b]/10 text-[#c1242b] px-5 py-2 rounded-full mb-5">

              <GraduationCap size={18} />

              Admissions Open For 2027

            </div>

            <h2 className="text-5xl font-black text-black">

              Student Admission Application

            </h2>

            <p className="text-lg text-black mt-5">

              Complete the application form below.

            </p>

          </div>

          <form
            action="mailto:admissions@mzinyathigardens.co.zw"
            method="POST"
            encType="multipart/form-data"
            className="bg-white rounded-[40px] p-10 shadow-2xl"
          >

            <div className="grid md:grid-cols-2 gap-6">

              <input
                type="text"
                placeholder="First Name"
                className="border-2 border-gray-300 rounded-xl p-4 text-black"
                required
              />

              <input
                type="text"
                placeholder="Surname"
                className="border-2 border-gray-300 rounded-xl p-4 text-black"
                required
              />

              <input
                type="date"
                className="border-2 border-gray-300 rounded-xl p-4 text-black"
                required
              />

              <select
                className="border-2 border-gray-300 rounded-xl p-4 text-black"
                required
              >
                <option>Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>

              <input
                type="text"
                placeholder="Nationality"
                className="border-2 border-gray-300 rounded-xl p-4 text-black"
              />

              <input
                type="text"
                placeholder="Birth Certificate Number"
                className="border-2 border-gray-300 rounded-xl p-4 text-black"
              />

              <select
                className="border-2 border-gray-300 rounded-xl p-4 text-black"
              >
                <option>Grade Applying For</option>
                <option>ECD A</option>
                <option>ECD B</option>
                <option>Grade 1</option>
                <option>Grade 2</option>
                <option>Grade 3</option>
                <option>Grade 4</option>
                <option>Grade 5</option>
                <option>Grade 6</option>
                <option>Grade 7</option>
              </select>

              <input
                type="text"
                placeholder="Previous School"
                className="border-2 border-gray-300 rounded-xl p-4 text-black"
              />

            </div>

            <div className="mt-8">

              <textarea
                rows={5}
                placeholder="Parent / Guardian Information"
                className="w-full border-2 border-gray-300 rounded-xl p-4 text-black"
              />

            </div>
            {/* DOCUMENT UPLOADS */}

            <div className="mt-10">

              <h3 className="text-2xl font-black text-black mb-6">
                Required Documents
              </h3>

              <div className="grid md:grid-cols-2 gap-6">

                <div>
                  <label className="block font-bold text-black mb-2">
                    Birth Certificate Copy
                  </label>

                  <input
                    type="file"
                    className="w-full border-2 border-gray-300 rounded-xl p-4 text-black"
                  />
                </div>

                <div>
                  <label className="block font-bold text-black mb-2">
                    Previous School Report
                  </label>

                  <input
                    type="file"
                    className="w-full border-2 border-gray-300 rounded-xl p-4 text-black"
                  />
                </div>

                <div>
                  <label className="block font-bold text-black mb-2">
                    Parent / Guardian ID Copy
                  </label>

                  <input
                    type="file"
                    className="w-full border-2 border-gray-300 rounded-xl p-4 text-black"
                  />
                </div>

                <div>
                  <label className="block font-bold text-black mb-2">
                    Proof Of Residence
                  </label>

                  <input
                    type="file"
                    className="w-full border-2 border-gray-300 rounded-xl p-4 text-black"
                  />
                </div>

              </div>

              <button
                type="submit"
                className="
                mt-10
                bg-[#2654a7]
                hover:bg-[#1f468d]
                text-white
                px-10
                py-4
                rounded-xl
                font-bold
                transition
                hover:scale-105
                "
              >
                Submit Admission Application
              </button>

            </div>

          </form>

        </div>

      </section>

      {/* JOB APPLICATIONS */}

      <section
        id="jobs"
        className="py-24 bg-white"
      >

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">

            <div className="inline-flex items-center gap-2 bg-[#2654a7]/10 text-[#2654a7] px-5 py-2 rounded-full mb-5">

              <Briefcase size={18} />

              Recruitment For 2027

            </div>

            <h2 className="text-5xl font-black text-black">

              Join Our Founding Team

            </h2>

            <p className="text-lg text-black mt-5 max-w-3xl mx-auto">

              We are recruiting passionate and qualified
              professionals to help establish one of
              Bulawayo's leading schools.

            </p>

          </div>

          <form
            action="mailto:admissions@mzinyathigardens.co.zw"
            method="POST"
            encType="multipart/form-data"
            className="bg-gray-50 rounded-[40px] p-10 shadow-xl"
          >

            <div className="grid md:grid-cols-2 gap-6">

              <input
                type="text"
                placeholder="Full Name"
                className="border-2 border-gray-300 rounded-xl p-4 text-black"
                required
              />

              <input
                type="email"
                placeholder="Email Address"
                className="border-2 border-gray-300 rounded-xl p-4 text-black"
                required
              />

              <input
                type="tel"
                placeholder="Phone Number"
                className="border-2 border-gray-300 rounded-xl p-4 text-black"
                required
              />

              <select
                className="border-2 border-gray-300 rounded-xl p-4 text-black"
                required
              >
                <option>Select Position</option>

                <option>Principal</option>

                <option>Teacher</option>

                <option>Cook</option>

                <option>Cleaner</option>

                <option>Matron</option>

                <option>Boarding Master</option>

                <option>Administrator</option>

                <option>Receptionist</option>

                <option>Security Officer</option>

              </select>

              <input
                type="text"
                placeholder="Highest Qualification"
                className="border-2 border-gray-300 rounded-xl p-4 text-black"
                required
              />

              <input
                type="text"
                placeholder="Years Of Experience"
                className="border-2 border-gray-300 rounded-xl p-4 text-black"
              />

            </div>

            <div className="mt-6">

              <textarea
                rows={6}
                placeholder="Tell us about yourself and why you would like to join Mzinyathi Elite Primary School."
                className="w-full border-2 border-gray-300 rounded-xl p-4 text-black"
              />

            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-8">

              <div>

                <label className="block font-bold text-black mb-2">
                  Upload CV
                </label>

                <input
                  type="file"
                  className="w-full border-2 border-gray-300 rounded-xl p-4 text-black"
                />

              </div>

              <div>

                <label className="block font-bold text-black mb-2">
                  Upload Qualifications
                </label>

                <input
                  type="file"
                  className="w-full border-2 border-gray-300 rounded-xl p-4 text-black"
                />

              </div>

            </div>

            <button
              type="submit"
              className="
              mt-10
              bg-[#c1242b]
              hover:bg-[#a91d24]
              text-white
              px-10
              py-4
              rounded-xl
              font-bold
              transition
              hover:scale-105
              "
            >
              Submit Job Application
            </button>

          </form>

        </div>

      </section>

      {/* FINAL CTA */}

      <section
        className="
        py-24
        bg-gradient-to-r
        from-[#2654a7]
        to-[#c1242b]
        text-white
        "
      >

        <div className="max-w-5xl mx-auto px-6 text-center">

          <Users
            size={60}
            className="mx-auto mb-8"
          />

          <h2 className="text-5xl font-black">

            Become Part Of The Mzinyathi Story

          </h2>

          <p className="mt-6 text-xl text-white/90">

            Admissions for 2027 are now open and
            recruitment is underway. Secure your place
            today and help shape the future.

          </p>

          <div className="flex flex-wrap justify-center gap-5 mt-10">

            <a
              href="#admissions"
              className="
              bg-white
              text-[#2654a7]
              px-8
              py-4
              rounded-xl
              font-bold
              hover:scale-105
              transition
              "
            >
              Student Admissions
            </a>

            <a
              href="#jobs"
              className="
              border-2
              border-white
              px-8
              py-4
              rounded-xl
              font-bold
              hover:bg-white
              hover:text-[#c1242b]
              transition
              "
            >
              Apply For Jobs
            </a>

          </div>

        </div>

      </section>

    </main>
  );
}