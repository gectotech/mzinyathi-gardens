export default function ActivitiesSection() {
  const activities = [
    {
      title: "Sports & Athletics",
      image: "/school/sport.jpg",
    },
    {
      title: "Clubs & Societies",
      image: "/school/club.jpg",
    },
    {
      title: "Cultural Activities",
      image: "/school/culture.jpg",
    },
    {
      title: "Educational Tours",
      image: "/school/tour.jpg",
    },
    {
      title: "Arts & Creativity",
      image: "/school/art.jpg",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">
          <h2 className="text-5xl font-bold text-[#001F6B]">
            School Activities
          </h2>

          <p className="text-gray-600 mt-4">
            Building confident, talented and well-rounded learners.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {activities.map((activity) => (
            <div
              key={activity.title}
              className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition"
            >
              <div className="overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="h-52 w-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>

              <div className="bg-white p-5">
                <h3 className="font-bold text-center text-[#001F6B]">
                  {activity.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}