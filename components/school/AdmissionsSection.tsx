import Link from "next/link";

export default function AdmissionsSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Left */}

          <div className="bg-[#001F6B] rounded-3xl overflow-hidden text-white">
            <img
              src="/school/student.jpg"
              alt="Students"
              className="w-full h-[350px] object-cover"
            />

            <div className="p-10">

              <h2 className="text-4xl font-bold">
                Admissions Open For 2027
              </h2>

              <p className="mt-5 text-gray-200">
                Become part of the founding learners of
                Mzinyathi Gardens Primary School.
              </p>

              <ul className="space-y-3 mt-6">
                <li>✓ ECD - Grade 7</li>
                <li>✓ Modern Learning Environment</li>
                <li>✓ Digital Education</li>
                <li>✓ Qualified Educators</li>
              </ul>

              <Link
                href="/school/admissions"
                className="inline-block mt-8 bg-yellow-500 text-black px-8 py-4 rounded-xl font-bold"
              >
                Apply Now
              </Link>
            </div>
          </div>

          {/* Right */}

          <div className="bg-yellow-500 rounded-3xl p-10">
            <h2 className="text-4xl font-bold text-black">
              Join Our Team
            </h2>

            <p className="mt-5 text-black">
              We are recruiting for our 2027 opening.
            </p>

            <ul className="space-y-3 mt-6 text-black font-medium">
              <li>Principal</li>
              <li>Teachers</li>
              <li>Matron</li>
              <li>Boarding Master</li>
              <li>Cooks</li>
              <li>Cleaners</li>
            </ul>

            <Link
              href="/school/careers"
              className="inline-block mt-8 bg-black text-white px-8 py-4 rounded-xl"
            >
              Apply Now
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}