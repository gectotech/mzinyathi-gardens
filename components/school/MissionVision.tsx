export default function MissionVision() {
  return (
    <section className="bg-white border-b">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3">

        <div className="p-10 border-r">
          <h3 className="font-bold text-2xl mb-4">
            Our Mission
          </h3>

          <p className="text-gray-600">
            To provide quality education in a safe, caring and
            inclusive environment that develops confident and
            responsible citizens.
          </p>
        </div>

        <div className="p-10 border-r">
          <h3 className="font-bold text-2xl mb-4">
            Our Vision
          </h3>

          <p className="text-gray-600">
            To be a leading primary school that inspires a passion
            for learning and prepares every child for success.
          </p>
        </div>

        <div className="p-10">
          <h3 className="font-bold text-2xl mb-4">
            Core Values
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <span>Respect</span>
            <span>Integrity</span>
            <span>Excellence</span>
            <span>Discipline</span>
            <span>Teamwork</span>
            <span>Compassion</span>
          </div>
        </div>

      </div>
    </section>
  );
}