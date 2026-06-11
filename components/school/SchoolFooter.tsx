import Image from "next/image";
import Link from "next/link";

export default function SchoolFooter() {
  return (
    <footer className="bg-white border-t">

      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid lg:grid-cols-4 gap-10">

          {/* LOGO */}

          <div>

            <div className="flex items-center gap-3 mb-5">

              <Image
                src="/school/slo.png"
                alt="School Logo"
                width={65}
                height={65}
              />

              <div>
                <h3 className="font-black text-[#04194b]">
                  Mzinyathi Gardens
                </h3>

                <p className="text-red-600 text-sm">
                  Primary School
                </p>
              </div>

            </div>

            <p className="text-gray-600 leading-8">
              Nurturing excellence, leadership, innovation and
              character as we prepare for our official opening
              in 2027.
            </p>

          </div>

          {/* QUICK LINKS */}

          <div>

            <h4 className="font-bold text-[#04194b] mb-5">
              Quick Links
            </h4>

            <div className="space-y-3">

              <Link href="/school">Home</Link><br />
              <Link href="/school/about">About Us</Link><br />
              <Link href="/school/admissions">Admissions</Link><br />
              <Link href="/school/what-we-offer">What We Offer</Link><br />
              <Link href="/school/news">News & Updates</Link>

            </div>

          </div>

          {/* ADMISSIONS */}

          <div>

            <h4 className="font-bold text-[#04194b] mb-5">
              Admissions
            </h4>

            <div className="space-y-3 text-gray-600">

              <p>ECD – Grade 7</p>
              <p>2027 Intake</p>
              <p>Application Forms</p>
              <p>Document Uploads</p>

            </div>

          </div>

          {/* CONTACT */}

          <div>

            <h4 className="font-bold text-[#04194b] mb-5">
              Contact Us
            </h4>

            <div className="space-y-3 text-gray-600">

              <p>Kensington, Bulawayo</p>

              <p>
                admissions@mzinyathigardens.co.zw
              </p>

              <p>
                Zimbabwe
              </p>

            </div>

          </div>

        </div>

      </div>

      <div className="bg-[#04194b] text-white text-center py-5">
        © 2027 Mzinyathi Gardens Primary School. All Rights Reserved.
      </div>

    </footer>
  );
}