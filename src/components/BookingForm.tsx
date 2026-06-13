"use client";

import { useActionState, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { createBooking } from "@/actions/booking";

const initialState: any = {
  success: false,
  message: "",
  error: "",
  booking: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? "Memproses..." : "Konfirmasi Booking"}
    </button>
  );
}

export default function BookingForm() {
  const [state, formAction] = useActionState(createBooking, initialState);
  const [date, setDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.ok ? res.json() : { user: null })
      .then(data => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (!date) {
      setBookedSlots([]);
      return;
    }
    setLoadingSlots(true);
    fetch(`/api/bookings/slots?date=${date}`)
      .then(res => res.json())
      .then(data => {
        if (data.bookedSlots) setBookedSlots(data.bookedSlots);
        else setBookedSlots([]);
      })
      .catch(() => setBookedSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [date]);

  const generateTimeSlots = () => {
    const slots = [];
    let currentHour = 8;
    let currentMinute = 0;
    while (currentHour < 17 || (currentHour === 17 && currentMinute === 0)) {
      const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      slots.push(timeStr);
      currentMinute += 15;
      if (currentMinute === 60) {
        currentHour++;
        currentMinute = 0;
      }
    }
    return slots;
  };

  if (state.success && state.booking) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left shadow-sm">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4 mx-auto md:mx-0">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{state.message}</h3>
        <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
          <div>
            <p className="text-sm text-slate-500">ID Booking</p>
            <p className="font-mono font-medium text-slate-900">{state.booking.id}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">Nama Lengkap</p>
              <p className="font-medium text-slate-900">{state.booking.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Nomor WhatsApp</p>
              <p className="font-medium text-slate-900">{state.booking.whatsapp}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Kendaraan</p>
              <p className="font-medium text-slate-900">{state.booking.vehicleType}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Layanan</p>
              <p className="font-medium text-slate-900">{state.booking.serviceType}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-slate-500">Jadwal</p>
              <p className="font-medium text-slate-900">{new Date(state.booking.bookingDate).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Buat Reservasi Baru
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 text-left">
      {state.error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
          {state.error}
        </div>
      )}

      {user && (
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">Memesan sebagai Member</p>
            <p className="text-xs text-blue-700">{user.name} ({user.whatsapp})</p>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="customerName" className="block text-sm font-medium text-slate-700 mb-1">
          Nama Lengkap
        </label>
        <input
          type="text"
          id="customerName"
          name="customerName"
          required
          defaultValue={user?.name || ""}
          readOnly={!!user}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 ${user ? 'bg-slate-100 border-transparent cursor-not-allowed text-slate-500' : 'bg-white border-slate-300'}`}
          placeholder="Budi Santoso"
        />
      </div>

      <div>
        <label htmlFor="whatsapp" className="block text-sm font-medium text-slate-700 mb-1">
          Nomor WhatsApp
        </label>
        <input
          type="tel"
          id="whatsapp"
          name="whatsapp"
          required
          defaultValue={user?.whatsapp || ""}
          readOnly={!!user}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 ${user ? 'bg-slate-100 border-transparent cursor-not-allowed text-slate-500' : 'bg-white border-slate-300'}`}
          placeholder="081234567890"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="vehicleType" className="block text-sm font-medium text-slate-700 mb-1">
            Jenis Kendaraan
          </label>
          <select
            id="vehicleType"
            name="vehicleType"
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-slate-900"
          >
            <option value="">Pilih</option>
            <option value="Mobil Kecil">Mobil Kecil (Brio, Agya)</option>
            <option value="Mobil Sedang">Mobil Sedang (Avanza, HR-V)</option>
            <option value="Mobil Besar">Mobil Besar (Pajero, Fortuner)</option>
            <option value="Motor Kecil">Motor Kecil (Beat, Vario)</option>
            <option value="Motor Besar">Motor Besar (NMAX, PCX)</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="serviceType" className="block text-sm font-medium text-slate-700 mb-1">
            Layanan
          </label>
          <select
            id="serviceType"
            name="serviceType"
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-slate-900"
          >
            <option value="">Pilih</option>
            <option value="Cuci Hidrolik">Cuci Hidrolik</option>
            <option value="Poles Body">Poles Body</option>
            <option value="Nano Coating">Nano Coating</option>
            <option value="Auto Detailing">Auto Detailing</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">
          Pilih Tanggal
        </label>
        <input
          type="date"
          id="date"
          required
          min={new Date().toISOString().split("T")[0]}
          value={date}
          onChange={(e) => { setDate(e.target.value); setSelectedTime(""); }}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 bg-white"
        />
      </div>

      {date && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Pilih Waktu (Per 15 Menit)
          </label>
          {loadingSlots ? (
            <div className="text-sm text-slate-500">Memuat slot waktu...</div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-200 rounded-lg bg-slate-50">
              {generateTimeSlots().map((time) => {
                const isBooked = bookedSlots.includes(time);
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    type="button"
                    disabled={isBooked}
                    onClick={() => setSelectedTime(time)}
                    className={`py-2 px-1 text-xs font-medium rounded-md transition-all ${
                      isBooked 
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                        : isSelected 
                          ? "bg-blue-600 text-white shadow-md" 
                          : "bg-white border border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-600"
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
      
      <input 
        type="hidden" 
        name="bookingDate" 
        required
        value={date && selectedTime ? `${date}T${selectedTime}:00+07:00` : ""} 
      />

      {/* Mock UI for DP Payment */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-3">
        <input 
          type="checkbox" 
          id="payDp" 
          name="payDp"
          className="mt-1" 
        />
        <div>
          <label htmlFor="payDp" className="text-sm font-medium text-blue-900 cursor-pointer">
            Bayar DP (Uang Muka) via QRIS
          </label>
          <p className="text-xs text-blue-700 mt-1">
            Centang untuk membayar DP Rp50.000 sekarang (Simulasi). Pembayaran penuh dilakukan di lokasi.
          </p>
        </div>
      </div>

      {user && user.points >= 300 && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-100 flex items-start gap-3 mt-2">
          <input 
            type="checkbox" 
            id="usePoints" 
            name="usePoints"
            className="mt-1" 
          />
          <div>
            <label htmlFor="usePoints" className="text-sm font-medium text-green-900 cursor-pointer">
              Tukar 300 Poin (Diskon 20%)
            </label>
            <p className="text-xs text-green-700 mt-1">
              Anda memiliki {user.points} poin. Centang untuk menukarkan poin dengan diskon 20% pada pesanan ini.
            </p>
          </div>
        </div>
      )}

      <div className="pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
