"use client";

import { useState } from "react";

export default function AdmissionsPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const applicationId =
      "MGP-" + Math.floor(100000 + Math.random() * 900000);

    alert(
      `Application Submitted Successfully!

Application Number: ${applicationId}

Status: Pending Review`
    );

    setSubmitted(true);
  }

  return (
    <main>

      {/* HERO SECTION */}

      <section
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.55)), url('/images/sa.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "450px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          color: "white",
          padding: "40px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "3rem",
              marginBottom: "20px",
              fontWeight: 800,
            }}
          >
            2027 Student Admissions
          </h1>

          <p
            style={{
              maxWidth: "800px",
              margin: "auto",
              fontSize: "1.1rem",
              lineHeight: "1.8",
            }}
          >
            Applications are now open for ECD to Grade 7
            for our inaugural 2027 intake at
            Mzinyathi Gardens Primary School.
          </p>
        </div>
      </section>

      {/* FORM SECTION */}

      <section
        style={{
          background: "#ffffff",
          padding: "80px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "auto",
          }}
        >
          <div className="form-card">

            <h2 className="page-title">
              Student Admission Form
            </h2>

            <p className="page-subtitle">
              Complete all required fields marked *
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit}>

                {/* LEARNER DETAILS */}

                <h3 className="section-title">
                  Learner Details
                </h3>

                <div className="grid">

                  <input
                    required
                    placeholder="First Name *"
                  />

                  <input
                    required
                    placeholder="Surname *"
                  />

                  <input
                    required
                    type="date"
                  />

                  <select required>
                    <option>Gender *</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>

                  <input
                    required
                    placeholder="Nationality *"
                  />

                  <input
                    required
                    placeholder="Birth Certificate Number *"
                  />

                  <select required>
                    <option>
                      Grade Applying For *
                    </option>

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
                    placeholder="Previous School"
                  />

                </div>

                <label className="upload-label">
                  Student Photo
                  <input type="file" />
                </label>

                {/* PARENT / GUARDIAN INFORMATION */}

                <h3 className="section-title">
                  Parent / Guardian Information
                </h3>

                <div className="grid">

                  <input
                    required
                    placeholder="Full Name *"
                  />

                  <input
                    required
                    placeholder="Relationship to Child *"
                  />

                  <input
                    placeholder="National ID Number"
                  />

                  <input
                    required
                    placeholder="Phone Number *"
                  />

                  <input
                    placeholder="Alternative Phone Number"
                  />

                  <input
                    type="email"
                    placeholder="Email Address"
                  />

                  <input
                    placeholder="Occupation"
                  />

                </div>

                {/* RESIDENTIAL INFORMATION */}

                <h3 className="section-title">
                  Residential Information
                </h3>

                <div className="grid">

                  <input
                    required
                    placeholder="Home Address *"
                  />

                  <input
                    required
                    placeholder="City / Town *"
                  />

                  <input
                    required
                    placeholder="Province *"
                  />

                  <input
                    required
                    placeholder="Residential Area / Suburb *"
                  />

                  <input
                    placeholder="Postal Address"
                  />

                </div>

                {/* EMERGENCY CONTACT */}

                <h3 className="section-title">
                  Emergency Contact Information
                </h3>

                <div className="grid">

                  <input
                    required
                    placeholder="Emergency Contact Name *"
                  />

                  <input
                    required
                    placeholder="Relationship to Child *"
                  />

                  <input
                    required
                    placeholder="Emergency Contact Number *"
                  />

                  <input
                    placeholder="Alternative Emergency Number"
                  />

                </div>

                {/* MEDICAL INFORMATION */}

                <h3 className="section-title">
                  Medical Information
                </h3>

                <textarea
                  placeholder="Medical Conditions"
                />

                <textarea
                  placeholder="Allergies"
                />

                <textarea
                  placeholder="Disabilities / Special Needs"
                />

                <textarea
                  placeholder="Current Medication"
                />

                <textarea
                  placeholder="Doctor / Hospital Information"
                />

                {/* ACADEMIC INFORMATION */}

                <h3 className="section-title">
                  Academic Information
                </h3>

                <div className="grid">

                  <input
                    placeholder="Current School"
                  />

                  <input
                    required
                    placeholder="Last Grade Completed *"
                  />

                  <input
                    placeholder="Languages Spoken"
                  />

                  <input
                    placeholder="Talents / Interests"
                  />

                </div>

                <label className="upload-label">
                  Recent Results Upload
                  <input type="file" />
                </label>

                {/* DOCUMENT UPLOADS */}

                <h3 className="section-title">
                  Required Documents
                </h3>

                <div className="document-grid">

                  <div className="document-card">
                    <label>
                      Birth Certificate Copy *
                    </label>
                    <input
                      required
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>

                  <div className="document-card">
                    <label>
                      Previous School Report
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>

                  <div className="document-card">
                    <label>
                      Passport Photo
                    </label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                    />
                  </div>

                  <div className="document-card">
                    <label>
                      Parent / Guardian ID Copy *
                    </label>
                    <input
                      required
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>

                  <div className="document-card">
                    <label>
                      Proof of Residence
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>

                  <div className="document-card">
                    <label>
                      Transfer Letter
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>

                </div>

                {/* TRANSPORT */}

                <h3 className="section-title">
                  Transport Information
                </h3>

                <div className="grid">

                  <select>
                    <option>
                      Requires School Transport?
                    </option>

                    <option>Yes</option>
                    <option>No</option>
                  </select>

                  <input
                    placeholder="Pickup Area"
                  />

                </div>

                {/* DECLARATION */}

                <h3 className="section-title">
                  Declaration & Confirmation
                </h3>

                <div className="declaration-box">

                  <label className="checkbox-row">

                    <input
                      required
                      type="checkbox"
                    />

                    <span>
                      I certify that the information
                      provided is true and correct.
                    </span>

                  </label>

                  <input
                    required
                    placeholder="Parent / Guardian Signature *"
                  />

                </div>

                {/* INFO BOX */}

                <div className="application-info">

                  <h4>
                    Admission Process
                  </h4>

                  <ol>
                    <li>Complete the application form.</li>
                    <li>Upload required documents.</li>
                    <li>Submit application.</li>
                    <li>Admissions Office reviews application.</li>
                    <li>Parent/Guardian is contacted.</li>
                    <li>Successful applicants receive an offer letter.</li>
                  </ol>

                </div>

                {/* SUBMIT */}

                <div className="submit-section">

                  <button
                    type="submit"
                    className="submit-btn"
                  >
                    Submit Application
                  </button>

                  <p>
                    Admissions for the
                    2027 Academic Year
                  </p>

                  <p>
                    All applications are reviewed by
                    the Admissions Office.
                  </p>

                  <strong>
                    admissions@mzinyathigardens.co.zw
                  </strong>

                </div>

              </form>

            ) : (

              <div className="success-box">

                <h2>
                  Application Submitted Successfully
                </h2>

                <p>
                  Thank you for applying to
                  Mzinyathi Gardens Primary School.
                </p>

                <p>
                  Status: Pending Review
                </p>

              </div>

            )}

          </div>
        </div>
      </section>

      <style jsx>{`

        .form-card{
          background:#fff;
          padding:40px;
          border-radius:20px;
          box-shadow:0 10px 30px rgba(0,0,0,.08);
        }

        .page-title{
          color:#0f5132;
          font-size:2rem;
          margin-bottom:10px;
        }

        .page-subtitle{
          color:#666;
          margin-bottom:40px;
        }

        .section-title{
          color:#0f5132;
          margin-top:40px;
          margin-bottom:20px;
          font-size:1.3rem;
          font-weight:700;
        }

        .grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
          gap:15px;
          margin-bottom:20px;
        }

        input,
        select,
        textarea{
          width:100%;
          padding:14px;
          border:1px solid #d1d5db;
          border-radius:8px;
          font-size:15px;
          background:#fff;
          color:#111;
        }

        textarea{
          min-height:100px;
          margin-bottom:15px;
        }

        .upload-label{
          display:block;
          margin-bottom:20px;
          color:#111;
          font-weight:600;
        }

        .document-grid{
          display:grid;
          grid-template-columns:
          repeat(auto-fit,minmax(280px,1fr));
          gap:20px;
        }

        .document-card{
          background:#f8fafc;
          padding:18px;
          border-radius:12px;
          border:1px solid #e5e7eb;
        }

        .document-card label{
          display:block;
          margin-bottom:10px;
          font-weight:600;
          color:#111827;
        }

        .declaration-box{
          background:#f8fafc;
          padding:25px;
          border-radius:12px;
          margin-top:20px;
        }

        .checkbox-row{
          display:flex;
          gap:12px;
          margin-bottom:20px;
          align-items:flex-start;
        }

        .application-info{
          margin-top:40px;
          background:#ecfdf5;
          border-left:5px solid #0f5132;
          padding:25px;
          border-radius:10px;
        }

        .application-info h4{
          margin-bottom:15px;
          color:#0f5132;
        }

        .application-info ol{
          padding-left:20px;
          line-height:1.9;
          color:#374151;
        }

        .submit-section{
          text-align:center;
          margin-top:40px;
        }

        .submit-btn{
          background:#0f5132;
          color:white;
          border:none;
          padding:15px 35px;
          border-radius:10px;
          font-size:16px;
          font-weight:700;
          cursor:pointer;
        }

        .submit-btn:hover{
          background:#0b3f27;
        }

        .submit-section p{
          margin-top:10px;
          color:#666;
        }

        .success-box{
          text-align:center;
          padding:60px;
        }

        @media(max-width:768px){

          .form-card{
            padding:25px;
          }

          .page-title{
            font-size:1.7rem;
          }

        }

      `}</style>

    </main>
  );
}