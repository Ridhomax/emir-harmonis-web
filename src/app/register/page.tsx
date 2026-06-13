"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Daftar Menjadi Member
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Dapatkan poin untuk setiap transaksi dan undang teman!
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                Nama Lengkap
              </label>
              <input id="name" name="name" type="text" required className="w-full px-4 py-2 border rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-900 outline-none" />
            </div>

            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-slate-700 mb-1">
                Nomor WhatsApp <br/><span className="text-xs text-slate-500 font-normal">(Jika Anda pernah booking, gunakan nomor yang sama agar riwayat pesanan tersambung)</span>
              </label>
              <input id="whatsapp" name="whatsapp" type="tel" required className="w-full px-4 py-2 border rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-900 outline-none" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input id="email" name="email" type="email" required className="w-full px-4 py-2 border rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-900 outline-none" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Kata Sandi
              </label>
              <input id="password" name="password" type="password" required className="w-full px-4 py-2 border rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-900 outline-none" />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">
                Alamat
              </label>
              <textarea id="address" name="address" rows={2} className="w-full px-4 py-2 border rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-900 outline-none"></textarea>
            </div>

            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-slate-700 mb-1">
                Tanggal Lahir
              </label>
              <input id="dob" name="dob" type="date" className="w-full px-4 py-2 border rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-900 outline-none" />
            </div>

            <div>
              <label htmlFor="referredBy" className="block text-sm font-medium text-slate-700 mb-1">
                Kode Referral Teman <span className="text-xs text-slate-500">(Opsional)</span>
              </label>
              <input id="referredBy" name="referredBy" type="text" className="w-full px-4 py-2 border rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-900 uppercase outline-none" placeholder="Masukkan jika ada" />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition"
              >
                {loading ? "Mendaftar..." : "Daftar Sekarang"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 text-sm transition">
              Sudah punya akun? Masuk di sini
            </Link>
          </div>
          <div className="mt-2 text-center">
             <Link href="/" className="font-medium text-slate-500 hover:text-slate-700 text-xs transition">
              Kembali ke Beranda
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
