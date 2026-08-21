"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include" // Penting untuk menyimpan cookie HttpOnly dari server
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setError(result.message || "Email atau password tidak valid");
        setLoading(false);
      } else {
        // Berhasil login dan cookie sudah tersimpan
        router.push("/admin");
      }
    } catch (err) {
      console.error(err);
      setError("Gagal terhubung ke server");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center relative overflow-hidden" style={{ background: "linear-gradient(0deg, #E8F5EE, #E8F5EE), #FFFFFF" }}>
      {/* Ambient background pattern placeholder */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('/pattern.png')] bg-repeat" />

      {/* Main Card */}
      <div className="relative z-10 flex flex-col items-center bg-white rounded shadow-[0px_4px_20px_rgba(0,0,0,0.05)] w-full max-w-[448px]" style={{ border: "1px solid rgba(191, 201, 190, 0.3)" }}>
        
        {/* Header Section */}
        <div className="flex flex-col items-center w-full px-8 pt-8 pb-4" style={{ borderBottom: "1px solid rgba(191, 201, 190, 0.2)" }}>
          <div className="flex items-center justify-center w-16 h-16 rounded-xl mb-2" style={{ background: "rgba(167, 244, 186, 0.2)" }}>
            <div className="w-8 h-8 flex items-center justify-center">
              {/* Fallback Icon */}
              <svg width="32" height="27" viewBox="0 0 32 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0L32 13.5H28V26.67H20V17.33H12V26.67H4V13.5H0L16 0Z" fill="#00522A"/>
              </svg>
            </div>
          </div>
          
          <h1 className="font-display font-semibold text-[32px] leading-[42px] text-center mb-2" style={{ color: "#00522A" }}>
            Hannah Hotel Syari'ah
          </h1>
          <p className="font-sans text-sm text-center" style={{ color: "#404941" }}>
            Admin Portal
          </p>
        </div>

        {/* Form Section */}
        <div className="flex flex-col w-full p-8 space-y-8">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded border border-red-200">
                {error}
              </div>
            )}
            
            {/* Username / Email Field */}
            <div className="flex flex-col space-y-2">
              <label className="font-sans font-semibold text-sm tracking-wide" style={{ color: "#404941" }}>
                Username / Email
              </label>
              <div className="relative w-full h-[50px]">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#707A70]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@hannahhotel.com"
                  required
                  className="w-full h-full pl-10 pr-4 outline-none font-sans text-base text-[#404941]"
                  style={{ background: "#FCF9F8", border: "1px solid #BFC9BE" }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col space-y-2">
              <label className="font-sans font-semibold text-sm tracking-wide" style={{ color: "#404941" }}>
                Password
              </label>
              <div className="relative w-full h-[50px]">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#707A70]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  className="w-full h-full pl-10 pr-4 outline-none font-sans text-base text-[#404941]"
                  style={{ background: "#FCF9F8", border: "1px solid #BFC9BE" }}
                />
              </div>
            </div>

            {/* Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[41px] flex justify-center items-center gap-2 shadow-sm font-sans font-semibold text-sm tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-70"
                style={{ background: "#1E6B3E" }}
              >
                {loading ? "Memproses..." : "Masuk"}
                {!loading && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                )}
              </button>
            </div>
          </form>

          {/* Caption / Back to Website */}
          <div className="flex justify-center items-center gap-2 pt-4 w-full" style={{ borderTop: "1px solid rgba(191, 201, 190, 0.2)" }}>
            <Link href="/" className="flex items-center gap-1 font-sans text-sm text-[#3D4944] hover:text-[#1E6B3E]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Kembali ke Halaman Utama
            </Link>
          </div>
        </div>

        {/* Ornamental Bottom Edge */}
        <div className="w-full h-1 opacity-80" style={{ background: "linear-gradient(90deg, #1E6B3E 0%, #FE9340 50%, #1E6B3E 100%)" }}></div>
      </div>
    </div>
  );
}
