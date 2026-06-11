"use client";

import { useState } from "react";
import SchoolAdmissionForm from "@/components/school/SchoolAdmissionForm";

export default function AdmissionsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState("");

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
              <SchoolAdmissionForm
                source="admissions_page"
                onSuccess={(id) => {
                  setTrackingId(id);
                  setSubmitted(true);
                }}
              />
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
                  Application Number: <strong>{trackingId}</strong>
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