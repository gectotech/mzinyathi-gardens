const items = [
  "Academic Excellence",
  "Co-Curricular Activities",
  "Sports & Wellness",
  "Technology & Innovation",
  "Character Development",
];

export default function WhatWeOffer() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-center text-5xl font-bold mb-16">
          What We Offer
        </h2>

        <div className="grid md:grid-cols-5 gap-6">

          {items.map((item) => (
            <div
              key={item}
              className="border rounded-2xl p-8 text-center hover:shadow-xl transition"
            >
              <div className="w-20 h-20 rounded-full bg-[#F4B400] mx-auto mb-5" />

              <h3 className="font-bold">
                {item}
              </h3>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}