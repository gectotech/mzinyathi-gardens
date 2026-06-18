"use client";

import { useState } from "react";
import { Eye, EyeOff, ArrowLeft, CheckCircle, GraduationCap, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

type AuthMode = "choose" | "login" | "register" | "forgot";

export default function StudentPortalPage() {
  const router = useRouter();

  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    studentNumber: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleLogin = () => {
    if (!form.studentNumber || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      // Check for demo account first (takes priority)
      if (form.studentNumber === "R216988M" && form.password === "Missie02") {
        const demoUser = {
          firstname: "Mila",
          lastname: "Doe",
          studentNumber: "R216988M",
          email: "mila.doe@example.com",
          password: "Missie02",
          portalType: "admissions",
          appId: "MGPS-A-DEMO001",
        };
        localStorage.setItem("portalUser", JSON.stringify(demoUser));
        setLoading(false);
        setSuccess(true);
        setTimeout(() => router.push("/school/pathway/admissions/dashboard"), 900);
        return;
      }

      const stored = localStorage.getItem("portalUser");
      if (stored) {
        const user = JSON.parse(stored);
        if (user.studentNumber === form.studentNumber && user.password === form.password && user.portalType === "admissions") {
          setLoading(false);
          setSuccess(true);
          setTimeout(() => router.push("/school/pathway/admissions/dashboard"), 900);
          return;
        }
      }
      setLoading(false);
      setError("Invalid student number or password. Please try again or register.");
    }, 1200);
  };

  const handleRegister = () => {
    if (!form.firstname || !form.lastname || !form.email || !form.password || !form.confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const user = {
        firstname: form.firstname,
        lastname: form.lastname,
        studentNumber: "", // Will be generated after admission
        email: form.email,
        password: form.password,
        portalType: "admissions",
        appId: `MGPS-A-${Date.now().toString().slice(-6)}`,
      };
      localStorage.setItem("portalUser", JSON.stringify(user));
      setLoading(false);
      setSuccess(true);
      setTimeout(() => router.push("/school/pathway/admissions/dashboard"), 900);
    }, 1200);
  };

  const handleForgotPassword = () => {
    if (!form.studentNumber) {
      setError("Please enter your student number.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setError("");
      setTimeout(() => {
        setSuccess(false);
        setAuthMode("login");
      }, 2000);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-900 text-white">
      <div className="container mx-auto px-6 py-20 flex items-center justify-center min-h-screen">

        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500/30 to-yellow-600/30 border border-yellow-400/40 mb-6 shadow-lg">
              <GraduationCap className="w-10 h-10 text-yellow-400" />
            </div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-red-500 via-blue-500 to-white bg-clip-text text-transparent">
              Welcome to MIRA
            </h1>
            <p className="text-gray-300">Create an account or log in to access the admissions portal</p>
          </div>

          {/* Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">

            {/* Success state */}
            {success && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border border-green-400/30 mb-4">
                  <CheckCircle size={40} className="text-green-400" />
                </div>
                <p className="text-xl font-bold text-white mb-2">Welcome to MGPS!</p>
                <p className="text-gray-300 mb-4">Redirecting you to your dashboard…</p>
                <div className="w-8 h-8 border-3 border-white/30 border-t-green-400 rounded-full animate-spin mx-auto" />
              </div>
            )}

            {/* Choose: login or register */}
            {!success && authMode === "choose" && (
              <div className="text-center">
                <p className="text-xl font-bold text-gray-800 mb-3">How would you like to continue?</p>
                <p className="text-gray-600 mb-6 text-sm">
                  Create an account to apply for the 2027 intake, or log in if you've applied before.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition"
                    onClick={() => setAuthMode("register")}
                  >
                    Create Account
                  </button>
                  <button
                    className="w-full py-3 bg-gray-100 text-gray-800 font-bold rounded-lg hover:bg-gray-200 transition border border-gray-300"
                    onClick={() => setAuthMode("login")}
                  >
                    Log In
                  </button>
                </div>
              </div>
            )}

            {/* Login form */}
            {!success && authMode === "login" && (
              <div>
                <p className="text-xl font-bold text-white mb-6">Log in to Student Portal</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Student Number</label>
                    <input
                      name="studentNumber"
                      value={form.studentNumber}
                      onChange={handleChange}
                      placeholder="e.g., R216809M"
                      className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-yellow-400 focus:bg-white/20 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Password</label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Your password"
                        className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-yellow-400 focus:bg-white/20 transition pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-400 bg-red-500/20 border border-red-400/30 rounded-lg px-4 py-3 text-sm font-semibold">
                      {error}
                    </p>
                  )}

                  <button
                    className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition flex items-center justify-center gap-2"
                    onClick={handleLogin}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Logging in…
                      </>
                    ) : (
                      "Log In"
                    )}
                  </button>

                  <div className="flex justify-between text-sm">
                    <button
                      onClick={() => {
                        setAuthMode("register");
                        setError("");
                      }}
                      className="text-yellow-400 font-bold hover:text-yellow-300"
                    >
                      Register here
                    </button>
                    <button
                      onClick={() => {
                        setAuthMode("forgot");
                        setError("");
                      }}
                      className="text-blue-400 font-bold hover:text-blue-300"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Register form */}
            {!success && authMode === "register" && (
              <div>
                <button
                  className="flex items-center gap-2 text-gray-400 text-sm font-semibold mb-4 hover:text-gray-200"
                  onClick={() => {
                    setAuthMode("login");
                    setError("");
                  }}
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <p className="text-xl font-bold text-white mb-6">Create your account</p>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">First Name</label>
                      <input
                        name="firstname"
                        value={form.firstname}
                        onChange={handleChange}
                        placeholder="First name"
                        className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-yellow-400 focus:bg-white/20 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Last Name</label>
                      <input
                        name="lastname"
                        value={form.lastname}
                        onChange={handleChange}
                        placeholder="Last name"
                        className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-yellow-400 focus:bg-white/20 transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Email Address</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-yellow-400 focus:bg-white/20 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Password</label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Min. 6 characters"
                        className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-yellow-400 focus:bg-white/20 transition pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Confirm Password</label>
                    <input
                      name="confirm"
                      type={showPassword ? "text" : "password"}
                      value={form.confirm}
                      onChange={handleChange}
                      placeholder="Repeat password"
                      className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-yellow-400 focus:bg-white/20 transition"
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 bg-red-500/20 border border-red-400/30 rounded-lg px-4 py-3 text-sm font-semibold">
                      {error}
                    </p>
                  )}

                  <button
                    className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition flex items-center justify-center gap-2"
                    onClick={handleRegister}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Creating account…
                      </>
                    ) : (
                      "Create Account & Continue"
                    )}
                  </button>

                  <p className="text-center text-gray-400 text-sm">
                    Already have an account?{" "}
                    <button
                      onClick={() => {
                        setAuthMode("login");
                        setError("");
                      }}
                      className="text-yellow-400 font-bold hover:text-yellow-300"
                    >
                      Log in here
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* Forgot password form */}
            {!success && authMode === "forgot" && (
              <div>
                <button
                  className="flex items-center gap-2 text-gray-400 text-sm font-semibold mb-4 hover:text-gray-200"
                  onClick={() => {
                    setAuthMode("login");
                    setError("");
                  }}
                >
                  <ArrowLeft size={14} /> Back to Login
                </button>
                <p className="text-xl font-bold text-white mb-6">Reset Password</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Student Number</label>
                    <input
                      name="studentNumber"
                      value={form.studentNumber}
                      onChange={handleChange}
                      placeholder="e.g., R216809M"
                      className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-yellow-400 focus:bg-white/20 transition"
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 bg-red-500/20 border border-red-400/30 rounded-lg px-4 py-3 text-sm font-semibold">
                      {error}
                    </p>
                  )}

                  {success && (
                    <p className="text-green-400 bg-green-500/20 border border-green-400/30 rounded-lg px-4 py-3 text-sm font-semibold">
                      Password reset instructions sent to your email.
                    </p>
                  )}

                  <button
                    className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition flex items-center justify-center gap-2"
                    onClick={handleForgotPassword}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Sending…
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="text-center text-green-200/50 text-sm mt-8">
            MGPS · Mzinyathi Gardens Primary School · Zimbabwe
          </p>
        </div>
      </div>
    </main>
  );
}
