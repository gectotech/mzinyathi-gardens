"use client";

import { useState } from "react";
import { GraduationCap, Briefcase, X, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

type PortalType = "admissions" | "jobs";
type AuthMode = "choose" | "login" | "register";

export default function PortalPage() {
  const router = useRouter();

  const [portalType, setPortalType]   = useState<PortalType | null>(null);
  const [authMode, setAuthMode]       = useState<AuthMode>("choose");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [success, setSuccess]         = useState(false);
  const [error, setError]             = useState("");

  const [form, setForm] = useState({
    firstname: "", lastname: "", email: "", password: "", confirm: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const openPortal = (type: PortalType) => {
    setPortalType(type);
    setAuthMode("choose");
    setForm({ firstname: "", lastname: "", email: "", password: "", confirm: "" });
    setError("");
    setSuccess(false);
  };

  const closeModal = () => {
    setPortalType(null);
    setAuthMode("choose");
    setError("");
  };

  const handleLogin = () => {
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setTimeout(() => {
      const stored = localStorage.getItem("portalUser");
      if (stored) {
        const user = JSON.parse(stored);
        if (user.email === form.email && user.password === form.password && user.portalType === portalType) {
          setLoading(false);
          setSuccess(true);
          setTimeout(() => router.push(`/school/portal/${portalType}/dashboard`), 900);
          return;
        }
      }
      setLoading(false);
      setError("Invalid email or password. Please try again or register.");
    }, 1200);
  };

  const handleRegister = () => {
    if (!form.firstname || !form.lastname || !form.email || !form.password || !form.confirm) {
      setError("Please fill in all fields."); return;
    }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    setTimeout(() => {
      const user = {
        firstname: form.firstname,
        lastname:  form.lastname,
        email:     form.email,
        password:  form.password,
        portalType,
        appId: `MGPS-${portalType === "admissions" ? "A" : "J"}-${Date.now().toString().slice(-6)}`,
      };
      localStorage.setItem("portalUser", JSON.stringify(user));
      setLoading(false);
      setSuccess(true);
      setTimeout(() => router.push(`/school/portal/${portalType}/dashboard`), 900);
    }, 1200);
  };

  const label = portalType === "admissions" ? "Admissions Portal" : "Careers Portal";
  const accent = portalType === "admissions" ? "#eab308" : "#22c55e";
  const accentLight = portalType === "admissions" ? "#fef9c3" : "#dcfce7";
  const accentDark  = portalType === "admissions" ? "#a16207" : "#15803d";

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-900 text-white">
      <div className="container mx-auto px-6 py-20">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-sm text-green-200 mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Grand Opening · January 2027
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            MGPS Portal
          </h1>
          <p className="mt-6 text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
            Welcome to the official Mzinyathi Gardens Preparatory School Portal.
            Select the service you would like to access.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">

          {/* Admissions */}
          <Link href="/school/admissions">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 border border-yellow-400/30 flex items-center justify-center mb-6">
                  <GraduationCap className="w-8 h-8 text-yellow-400" />
                </div>
                <h2 className="text-3xl font-bold mb-3">Admissions</h2>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  Apply for enrolment, monitor your application progress, make payments and communicate directly with the admissions office.
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition-colors">
                  <GraduationCap size={18} /> Get Started
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Jobs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 overflow-hidden group cursor-pointer"
            onClick={() => openPortal("jobs")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-green-500/20 border border-green-400/30 flex items-center justify-center mb-6">
                <Briefcase className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold mb-3">Careers Portal</h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Apply for positions, upload qualifications, track your recruitment progress and receive updates directly from the HR team.
              </p>
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-400 transition-colors">
                <Briefcase size={18} /> Get Started
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-green-200/50 text-sm mt-16"
        >
          MGPS · Mzinyathi Gardens Preparatory School · Zimbabwe
        </motion.p>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {portalType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="modal"
            >
              {/* Modal header */}
              <div className="modal-head" style={{ background: `linear-gradient(135deg, #0b2d6b, #1a4a9f)` }}>
                <div className="modal-head-icon" style={{ background: `${accent}25`, border: `1px solid ${accent}40` }}>
                  {portalType === "admissions"
                    ? <GraduationCap size={22} color={accent} />
                    : <Briefcase size={22} color={accent} />}
                </div>
                <div>
                  <p className="modal-tag" style={{ color: accent }}>MGPS</p>
                  <h3 className="modal-title">{label}</h3>
                </div>
                <button className="modal-close" onClick={closeModal}><X size={18} /></button>
              </div>

              <div className="modal-body">

                {/* Success state */}
                {success && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="success-state">
                    <div className="success-icon"><CheckCircle size={36} color="#22c55e" /></div>
                    <p className="success-title">Welcome to MGPS!</p>
                    <p className="success-sub">Redirecting you to your dashboard…</p>
                    <div className="success-spinner" />
                  </motion.div>
                )}

                {/* Choose: login or register */}
                {!success && authMode === "choose" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="choose-screen">
                    <p className="choose-title">How would you like to continue?</p>
                    <p className="choose-sub">
                      {portalType === "admissions"
                        ? "Create an account to apply for the 2027 intake, or log in if you've applied before."
                        : "Create an account to apply for a position, or log in to track your existing application."}
                    </p>
                    <div className="choose-btns">
                      <button
                        className="choose-btn primary"
                        style={{ background: accent, color: portalType === "admissions" ? "#000" : "#fff" }}
                        onClick={() => setAuthMode("register")}
                      >
                        Create Account
                      </button>
                      <button className="choose-btn secondary" onClick={() => setAuthMode("login")}>
                        Log In
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Login form */}
                {!success && authMode === "login" && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <button className="back-btn" onClick={() => { setAuthMode("choose"); setError(""); }}>
                      <ArrowLeft size={14} /> Back
                    </button>
                    <p className="form-title">Log in to {label}</p>

                    <div className="field">
                      <label>Email Address</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
                    </div>
                    <div className="field">
                      <label>Password</label>
                      <div className="pw-wrap">
                        <input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={form.password}
                          onChange={handleChange}
                          placeholder="Your password"
                        />
                        <button className="pw-toggle" onClick={() => setShowPassword(v => !v)} type="button">
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    {error && <p className="error-msg">{error}</p>}

                    <button
                      className="submit-btn"
                      style={{ background: `linear-gradient(135deg, #0b2d6b, #1a4a9f)` }}
                      onClick={handleLogin}
                      disabled={loading}
                    >
                      {loading ? <><span className="spin" /> Logging in…</> : "Log In"}
                    </button>

                    <p className="switch-hint">
                      Don't have an account?{" "}
                      <button onClick={() => { setAuthMode("register"); setError(""); }} style={{ color: accent }}>
                        Register here
                      </button>
                    </p>
                  </motion.div>
                )}

                {/* Register form */}
                {!success && authMode === "register" && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <button className="back-btn" onClick={() => { setAuthMode("choose"); setError(""); }}>
                      <ArrowLeft size={14} /> Back
                    </button>
                    <p className="form-title">Create your account</p>

                    <div className="name-row">
                      <div className="field">
                        <label>First Name</label>
                        <input name="firstname" value={form.firstname} onChange={handleChange} placeholder="First name" />
                      </div>
                      <div className="field">
                        <label>Last Name</label>
                        <input name="lastname" value={form.lastname} onChange={handleChange} placeholder="Last name" />
                      </div>
                    </div>
                    <div className="field">
                      <label>Email Address</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
                    </div>
                    <div className="field">
                      <label>Password</label>
                      <div className="pw-wrap">
                        <input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={form.password}
                          onChange={handleChange}
                          placeholder="Min. 6 characters"
                        />
                        <button className="pw-toggle" onClick={() => setShowPassword(v => !v)} type="button">
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                    <div className="field">
                      <label>Confirm Password</label>
                      <input
                        name="confirm"
                        type={showPassword ? "text" : "password"}
                        value={form.confirm}
                        onChange={handleChange}
                        placeholder="Repeat password"
                      />
                    </div>

                    {error && <p className="error-msg">{error}</p>}

                    <button
                      className="submit-btn"
                      style={{ background: `linear-gradient(135deg, #0b2d6b, #1a4a9f)` }}
                      onClick={handleRegister}
                      disabled={loading}
                    >
                      {loading ? <><span className="spin" /> Creating account…</> : "Create Account & Continue"}
                    </button>

                    <p className="switch-hint">
                      Already have an account?{" "}
                      <button onClick={() => { setAuthMode("login"); setError(""); }} style={{ color: accent }}>
                        Log in here
                      </button>
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,.7);
          backdrop-filter: blur(6px); z-index: 200;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
        }
        .modal {
          background: white; border-radius: 20px; width: 100%; max-width: 460px;
          overflow: hidden; box-shadow: 0 32px 80px rgba(0,0,0,.4);
        }
        .modal-head {
          display: flex; align-items: center; gap: 14px;
          padding: 20px 24px; color: white;
        }
        .modal-head-icon {
          width: 46px; height: 46px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .modal-tag { font-size: .68rem; font-weight: 700; letter-spacing: .08em; opacity: .8; margin-bottom: 2px; }
        .modal-title { font-size: 1rem; font-weight: 800; }
        .modal-close {
          margin-left: auto; width: 32px; height: 32px; border-radius: 8px;
          border: 1px solid rgba(255,255,255,.2); background: rgba(255,255,255,.1);
          color: white; display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0; transition: background .2s;
        }
        .modal-close:hover { background: rgba(255,255,255,.2); }
        .modal-body { padding: 28px 28px 32px; }

        /* Choose screen */
        .choose-screen { text-align: center; }
        .choose-title { font-size: 1.05rem; font-weight: 800; color: #0b2d6b; margin-bottom: 8px; }
        .choose-sub { font-size: .82rem; color: #64748b; line-height: 1.6; margin-bottom: 28px; }
        .choose-btns { display: flex; flex-direction: column; gap: 10px; }
        .choose-btn {
          width: 100%; padding: 13px; border-radius: 10px; font-size: .9rem;
          font-weight: 700; border: none; cursor: pointer; transition: opacity .2s;
        }
        .choose-btn:hover { opacity: .88; }
        .choose-btn.secondary {
          background: #f1f5f9; color: #0b2d6b;
          border: 1.5px solid #e2e8f0;
        }

        /* Forms */
        .back-btn {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: .75rem; font-weight: 600; color: #64748b;
          background: none; border: none; cursor: pointer; margin-bottom: 16px;
          padding: 0; transition: color .2s;
        }
        .back-btn:hover { color: #0b2d6b; }
        .form-title { font-size: 1.05rem; font-weight: 800; color: #0b2d6b; margin-bottom: 20px; }
        .name-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
        label { font-size: .73rem; font-weight: 700; color: #475569; }
        input {
          padding: 10px 12px; border: 1.5px solid #e2e8f0; border-radius: 8px;
          font-size: .83rem; color: #0f172a; background: #f8fafc; outline: none;
          transition: border-color .2s; font-family: inherit; width: 100%;
        }
        input:focus { border-color: #0b2d6b; background: white; }
        .pw-wrap { position: relative; }
        .pw-wrap input { padding-right: 40px; }
        .pw-toggle {
          position: absolute; right: 11px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #94a3b8;
          display: flex; align-items: center;
        }
        .error-msg {
          font-size: .76rem; color: #c5252b; background: #fdeef0;
          border: 1px solid #c5252b30; border-radius: 8px;
          padding: 9px 12px; margin-bottom: 14px; font-weight: 600;
        }
        .submit-btn {
          width: 100%; padding: 13px; border: none; border-radius: 10px;
          color: white; font-size: .88rem; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: opacity .2s; margin-bottom: 16px;
        }
        .submit-btn:hover:not(:disabled) { opacity: .9; }
        .submit-btn:disabled { opacity: .6; cursor: not-allowed; }
        .spin {
          width: 15px; height: 15px; border: 2px solid rgba(255,255,255,.3);
          border-top-color: white; border-radius: 50%; animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .switch-hint { font-size: .76rem; color: #64748b; text-align: center; }
        .switch-hint button {
          background: none; border: none; cursor: pointer; font-weight: 700;
          font-size: .76rem; padding: 0;
        }

        /* Success */
        .success-state {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; padding: 12px 0 4px;
        }
        .success-icon {
          width: 72px; height: 72px; border-radius: 50%; background: #eefbf3;
          display: flex; align-items: center; justify-content: center; margin-bottom: 16px;
        }
        .success-title { font-size: 1.1rem; font-weight: 800; color: #0b2d6b; margin-bottom: 6px; }
        .success-sub { font-size: .8rem; color: #64748b; margin-bottom: 20px; }
        .success-spinner {
          width: 28px; height: 28px; border: 3px solid #e2e8f0;
          border-top-color: #0b2d6b; border-radius: 50%; animation: spin .8s linear infinite;
        }

        @media (max-width: 480px) {
          .modal-body { padding: 20px 20px 28px; }
          .name-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}