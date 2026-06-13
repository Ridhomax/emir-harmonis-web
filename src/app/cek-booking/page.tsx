"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { checkBookingStatus, submitPayment } from "@/actions/booking";
import Navbar from "@/components/Navbar";

const initialState = {
  success: false,
  error: "",
  booking: null as any,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed mt-4"
    >
      {pending ? "Mencari..." : "Cek Status"}
    </button>
  );
}

function PaymentForm({ bookingId }: { bookingId: string }) {
  const [method, setMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    try {
      const res = await submitPayment(null, formData);
      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.error || "Gagal");
      }
    } catch(err) {
      setError("Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-lg text-center font-medium border border-green-100">Pembayaran berhasil diproses.</div>;
  }

  return (
    <div className="mt-6 border-t pt-6">
      <h3 className="font-semibold text-slate-800 mb-4">Pilih Metode Pembayaran</h3>
      {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="bookingId" value={bookingId} />
        
        <div className="grid grid-cols-3 gap-3">
          <label className={`border rounded-lg p-3 text-center cursor-pointer transition ${method === 'Cash' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'hover:bg-slate-50'}`}>
            <input type="radio" name="paymentMethod" value="Cash" className="hidden" onChange={(e) => setMethod(e.target.value)} />
            <span className="font-medium text-slate-700 text-sm">Cash</span>
          </label>
          <label className={`border rounded-lg p-3 text-center cursor-pointer transition ${method === 'QRIS' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'hover:bg-slate-50'}`}>
            <input type="radio" name="paymentMethod" value="QRIS" className="hidden" onChange={(e) => setMethod(e.target.value)} />
            <span className="font-medium text-slate-700 text-sm">QRIS</span>
          </label>
          <label className={`border rounded-lg p-3 text-center cursor-pointer transition ${method === 'Bank' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'hover:bg-slate-50'}`}>
            <input type="radio" name="paymentMethod" value="Bank" className="hidden" onChange={(e) => setMethod(e.target.value)} />
            <span className="font-medium text-slate-700 text-sm">Transfer</span>
          </label>
        </div>

        {method === 'Cash' && (
          <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 text-center border border-slate-100">
            Silakan menuju kasir untuk melakukan pembayaran tunai.
          </div>
        )}

        {method === 'QRIS' && (
          <div className="bg-slate-50 p-4 rounded-lg flex flex-col items-center border border-slate-100">
            <p className="text-sm text-slate-600 mb-3 text-center">Scan QRIS berikut menggunakan aplikasi e-wallet atau m-banking Anda.</p>
            <img src="/qris.png" alt="QRIS Payment" className="w-48 h-48 object-contain bg-white p-2 rounded-lg shadow-sm border border-slate-200" />
          </div>
        )}

        {method === 'Bank' && (
          <div className="bg-slate-50 p-4 rounded-lg space-y-3 border border-slate-100">
            <div className="text-sm text-slate-700">
              <p className="font-medium mb-1">Transfer ke Rekening Berikut:</p>
              <ul className="list-disc pl-5 text-slate-600 space-y-1">
                <li>BCA: 1234567890 a.n. Emir Harmonis</li>
                <li>Mandiri: 0987654321 a.n. Emir Harmonis</li>
                <li>BRI: 1122334455 a.n. Emir Harmonis</li>
              </ul>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Upload Bukti Transfer</label>
              <input type="file" name="paymentProof" accept="image/*" required className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition" />
            </div>
          </div>
        )}

        <button type="submit" disabled={!method || isSubmitting} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition">
          {isSubmitting ? "Memproses..." : "Konfirmasi Pembayaran"}
        </button>
      </form>
    </div>
  );
}

export default function CekBookingPage() {
  const [state, formAction] = useActionState(checkBookingStatus, initialState);

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center pt-24 pb-12 px-4">
      <Navbar />
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100 mt-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Cek Status Booking</h1>
          <p className="text-slate-500 mt-2 text-sm">Masukkan ID Booking dan Nomor WhatsApp Anda untuk melihat status pesanan.</p>
        </div>

        {state.error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm text-center border border-red-100">
            {state.error}
          </div>
        )}

        {!state.success ? (
          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="bookingId" className="block text-sm font-medium text-slate-700 mb-1">ID Booking</label>
              <input
                type="text"
                id="bookingId"
                name="bookingId"
                required
                placeholder="Contoh: 123e4567-e89b-12d3..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-slate-700 mb-1">Nomor WhatsApp</label>
              <input
                type="tel"
                id="whatsapp"
                name="whatsapp"
                required
                placeholder="081234567890"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <SubmitButton />
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-200">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Status Pesanan</p>
                  <span className={`inline-block mt-1 px-3 py-1 text-xs font-bold rounded-full ${
                    state.booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    state.booking.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                    state.booking.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {state.booking.status}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-500">Nama Pelanggan</p>
                  <p className="font-medium text-slate-900">{state.booking.customerName}</p>
                </div>
                <div>
                  <p className="text-slate-500">Kendaraan & Layanan</p>
                  <p className="font-medium text-slate-900">{state.booking.vehicleType} - {state.booking.serviceType}</p>
                </div>
                <div>
                  <p className="text-slate-500">Jadwal</p>
                  <p className="font-medium text-slate-900">
                    {new Date(state.booking.bookingDate).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
                  </p>
                </div>
              </div>
              
              {state.booking.status === 'COMPLETED' && !state.booking.paymentMethod && (
                <PaymentForm bookingId={state.booking.id} />
              )}
              
              {state.booking.status === 'COMPLETED' && state.booking.paymentMethod && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="font-semibold text-slate-800 mb-3">Status Pembayaran</h3>
                  <div className="bg-green-50 text-green-800 p-4 rounded-xl text-sm flex justify-between items-center border border-green-100">
                    <span className="font-medium">Metode: {state.booking.paymentMethod}</span>
                    <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-bold">LUNAS</span>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition"
            >
              Cek Booking Lain
            </button>
            <Link href="/" className="block text-center text-sm text-blue-600 font-medium hover:underline">
              Kembali ke Beranda
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
