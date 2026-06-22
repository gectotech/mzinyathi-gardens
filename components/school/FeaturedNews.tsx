export default function FeaturedNews() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold mb-12">
          Featured News
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">

          <div className="bg-white rounded-3xl shadow overflow-hidden">
            <img
              src="/school/schooldev.jpg"
              className="h-[350px] w-full object-cover"
              alt="School Development"
            />

            <div className="p-8">
              <h3 className="text-3xl font-bold">
                School Development Progress For 2027 Opening
              </h3>

              <p className="mt-4 text-gray-600">
                Construction and development works continue as
                Mzinyathi Gardens prepares to launch its
                state-of-the-art primary school in 2027.
              </p>
            </div>
          </div>

          <div className="space-y-6">

            <div className="flex gap-4">
              <img
                src="/school/student.jpg"
                className="w-40 h-28 object-cover rounded-xl"
                alt="Students"
              />
              <div>
                <h4 className="font-bold">
                  2027 Student Enrolment Applications Open
                </h4>
              </div>
            </div>

            <div className="flex gap-4">
              <img
                src="/school/staff.jpg"
                className="w-40 h-28 object-cover rounded-xl"
                alt="Staff"
              />
              <div>
                <h4 className="font-bold">
                  Staff Recruitment For 2027
                </h4>
              </div>
            </div>

            <div className="flex gap-4">
              <img
                src="/school/school1.jpg"
                className="w-40 h-28 object-cover rounded-xl"
                alt="School Building"
              />
              <div>
                <h4 className="font-bold">
                  Kensington School Development Update
                </h4>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}