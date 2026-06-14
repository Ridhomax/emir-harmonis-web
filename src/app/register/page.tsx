"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Store form data between steps
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    email: "",
    password: "",
    address: "",
    dob: "",
    referredBy: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    // Basic validation for step 1
    if (!formData.name || !formData.whatsapp || !formData.email || !formData.password) {
      setError("Mohon lengkapi data pada tahap ini terlebih dahulu.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        window.location.href = "/user"; // Redirect to member dashboard
      } else {
        setError(result.error || "Pendaftaran gagal");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">

      {/* Simple Navbar (Logo Only) */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-center sm:justify-start">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:bg-blue-700 transition">
            E
          </div>
          <span className="font-bold text-xl text-slate-800 group-hover:text-blue-600 transition">Emir Harmonis</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md mt-10">
        <h2 className="text-center text-3xl font-extrabold text-slate-900">
          Daftar Menjadi Member
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Dapatkan poin untuk setiap transaksi dan undang teman!
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100">

          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8 gap-2">
            <div className={`w-1/2 h-2 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-slate-200'} transition-colors duration-300`}></div>
            <div className={`w-1/2 h-2 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'} transition-colors duration-300`}></div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={step === 2 ? handleSubmit : (e) => e.preventDefault()}>

            {/* Step 1: Informasi Utama */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-900 outline-none transition" placeholder="Masukkan nama Anda" />
                </div>

                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-slate-700 mb-1">
                    Nomor WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input id="whatsapp" name="whatsapp" type="tel" required value={formData.whatsapp} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-900 outline-none transition" placeholder="08xxxxxxxxxx" />
                  <p className="mt-1 text-xs text-slate-500">Gunakan nomor yang sama jika pernah booking.</p>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-900 outline-none transition" placeholder="email@contoh.com" />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                    Kata Sandi <span className="text-red-500">*</span>
                  </label>
                  <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-900 outline-none transition" placeholder="Minimal 6 karakter" />
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                  >
                    Lanjutkan
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Informasi Tambahan */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">
                    Alamat <span className="text-xs text-slate-500">(Opsional)</span>
                  </label>
                  <textarea id="address" name="address" rows={3} value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-900 outline-none transition" placeholder="Alamat lengkap Anda"></textarea>
                </div>

                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-slate-700 mb-1">
                    Tanggal Lahir <span className="text-xs text-slate-500">(Opsional)</span>
                  </label>
                  <input id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-900 outline-none transition" />
                </div>

                <div>
                  <label htmlFor="referredBy" className="block text-sm font-medium text-slate-700 mb-1">
                    Kode Referral Teman <span className="text-xs text-slate-500">(Opsional)</span>
                  </label>
                  <input id="referredBy" name="referredBy" type="text" value={formData.referredBy} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-900 uppercase outline-none transition" placeholder="Contoh: REF123" />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="w-1/3 flex justify-center py-3 px-4 border border-slate-300 rounded-xl shadow-sm text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition"
                  >
                    {loading ? "Mendaftar..." : "Daftar Sekarang"}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700 transition">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
