export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-primary mb-8">About Us</h1>
      <div className="space-y-12 max-w-4xl mx-auto">
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Company Overview</h2>
          <p className="text-gray-600 leading-relaxed">
            Mzinyathi Gardens is a <strong className="text-primary">community-driven gated development</strong> focused on affordable housing, infrastructure development, and sustainable living.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            To create a sustainable, innovative, and inclusive housing development that prioritizes:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li>Community engagement</li>
            <li>Environmental responsibility</li>
            <li>Affordable, high-quality living</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Our Vision</h2>
          <p className="text-gray-600 italic text-lg">“Empowering Communities, One Home at a Time.”</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Core Values</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Integrity & Transparency',
              'Community & Ubuntu',
              'Sustainability',
              'Accountability',
              'Long-term Value Creation',
            ].map((value) => (
              <div key={value} className="bg-gray-50 p-3 rounded-lg border-l-4 border-primary">
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}