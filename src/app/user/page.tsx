import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { LogOut, User as UserIcon, Calendar, Clock, CheckCircle, XCircle, Award, Users } from "lucide-react";
import LogoutButton from "./LogoutButton";

export default async function UserDashboard() {
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id as string },
    include: {
      bookings: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'PENDING': return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3"/> Pending</span>;
      case 'CONFIRMED': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Confirmed</span>;
      case 'COMPLETED': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Selesai</span>;
      case 'CANCELLED': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3"/> Batal</span>;
      default: return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">{status}</span>;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-6 py-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3">
              <span className="text-xl font-black tracking-widest uppercase text-slate-800">
                Emir<span className="text-blue-600">Harmonis</span>
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-600">
              <UserIcon className="w-5 h-5" />
              <span className="font-medium hidden md:inline">{user.name}</span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6 lg:p-8 max-w-5xl">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Profile Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4 mx-auto md:mx-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 text-center md:text-left">{user.name}</h2>
              <p className="text-slate-500 mb-6 text-center md:text-left">{user.email}</p>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 relative overflow-hidden">
                  <Award className="absolute -right-4 -bottom-4 w-24 h-24 text-blue-200 opacity-50" />
                  <p className="text-sm text-blue-800 font-medium mb-1 relative z-10">Total Poin Member</p>
                  <p className="text-4xl font-black text-blue-600 relative z-10">{user.points} <span className="text-lg font-bold text-blue-400">pts</span></p>
                  <p className="text-xs text-blue-600 mt-2 relative z-10">Kumpulkan 300 Poin = Diskon 20%</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm text-slate-500">Kode Referral Anda</p>
                    <Users className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-center">
                    <p className="font-mono font-bold tracking-widest text-lg text-slate-800">{user.referralCode}</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 text-center">Bagikan ke teman & dapatkan +5 Poin!</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                  <p className="text-sm text-slate-500 mb-1">Total Booking</p>
                  <p className="text-2xl font-black text-slate-800">{user.bookings.length}</p>
                </div>
                <Link href="/#booking" className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-xl font-semibold transition-all shadow-md hover:shadow-lg">
                  Buat Reservasi Baru
                </Link>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-600" /> Riwayat Booking
            </h3>
            
            {user.bookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-slate-300" />
                </div>
                <h4 className="text-lg font-bold text-slate-700 mb-2">Belum ada booking</h4>
                <p className="text-slate-500 mb-6">Anda belum pernah melakukan booking cuci mobil. Yuk, jadwalkan sekarang!</p>
                <Link href="/#booking" className="px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-semibold hover:bg-blue-100 transition-colors">
                  Mulai Booking
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {user.bookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-slate-800">{booking.serviceType}</h4>
                        <p className="text-slate-500">{booking.vehicleType} • {new Date(booking.bookingDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <div>
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400 mb-1">ID Booking</p>
                        <p className="font-mono text-slate-700 font-medium">{booking.id.split('-')[0]}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 mb-1">WhatsApp</p>
                        <p className="text-slate-700 font-medium">{booking.whatsapp}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 mb-1">Total Biaya</p>
                        <p className="text-slate-700 font-medium">Rp {booking.totalPrice.toLocaleString('id-ID')}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 mb-1">Diskon Poin</p>
                        <p className={`font-medium ${booking.discountApplied > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                          {booking.discountApplied > 0 ? `${booking.discountApplied}%` : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 mb-1">Poin Didapat</p>
                        <p className={`font-medium ${booking.pointsAwarded ? 'text-blue-600' : 'text-slate-400'}`}>
                          {booking.pointsAwarded ? `+${Math.floor(booking.totalPrice / 10000)}` : 'Belum Selesai'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
      </main>
    </div>
  );
}
