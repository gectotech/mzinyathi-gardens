import Link from "next/link";

export default function NewsSection() {
  const news = [
    {
      title: "School Development Progress",
      image: "/school/schooldev.jpg",
      text: "Construction and development works continue as we prepare for our 2027 opening.",
    },
    {
      title: "2027 Enrolment Applications Open",
      image: "/school/student.jpg",
      text: "Applications are now being accepted for ECD to Grade 7 learners.",
    },
    {
      title: "Staff Recruitment For 2027",
      image: "/school/staff.jpg",
      text: "We are recruiting teachers, principal, cooks, cleaners and boarding staff.",
    },
    {
      title: "Kensington Campus Development",
      image: "/school/school1.jpg",
      text: "The new Mzinyathi Gardens Primary School campus continues to take shape.",
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">
          <h2 className="text-5xl font-bold text-[#001F6B]">
            News & Updates
          </h2>

          <p className="text-gray-600 mt-4">
            Follow our journey towards opening in 2027.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">

          {news.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-3xl overflow-hidden shadow-lg"
            >
              <img
                src={item.image}
                alt=""
                className="h-56 w-full object-cover"
              />

              <div className="p-6">
                <h3 className="font-bold text-xl text-[#001F6B]">
                  {item.title}
                </h3>

                <p className="text-gray-600 mt-3">
                  {item.text}
                </p>

                <Link
                  href="/school/news"
                  className="inline-block mt-4 text-[#001F6B] font-bold"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}

        </div>

        <div className="text-center mt-12">
          <Link
            href="/school/news"
            className="bg-[#001F6B] text-white px-8 py-4 rounded-xl font-bold inline-block"
          >
            View All News & Updates
          </Link>
        </div>

      </div>
    </section>
  );
}