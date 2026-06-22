const news = [
  {
    image: "/school/student.jpg",
    title: "2027 Student Enrolment Applications Open",
  },
  {
    image: "/school/staff.jpg",
    title: "Recruitment Of Teachers & Support Staff",
  },
  {
    image: "/school/school1.jpg",
    title: "School Construction Progress Update",
  },
];

export default function LatestNews() {
  return (
    <section className="pb-24">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold mb-12">
          Latest News
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {news.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-3xl overflow-hidden shadow"
            >
              <img
                src={item.image}
                className="h-64 w-full object-cover"
                alt={item.title}
              />

              <div className="p-6">
                <h3 className="font-bold text-xl">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}