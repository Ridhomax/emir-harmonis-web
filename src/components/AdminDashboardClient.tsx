"use client";

import { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { updateBookingStatus, updateBookingCost } from "@/actions/booking";
import { generateBlogPost } from "@/actions/ai";

function AIGenerateButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
    >
      {pending ? "Menghasilkan..." : "Generate dengan AI"}
    </button>
  );
}

export default function AdminDashboardClient({ initialBookings, members, blogPosts, chartData }: any) {
  const [activeTab, setActiveTab] = useState("overview");
  const [aiState, aiAction] = useActionState(generateBlogPost, { success: false, message: "", error: "" });

  const [editingCostBooking, setEditingCostBooking] = useState<any>(null);
  const [costInput, setCostInput] = useState(0);
  const [reasonInput, setReasonInput] = useState("");

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateBookingStatus(id, newStatus);
  };

  const handleSaveCost = async () => {
    if (editingCostBooking) {
      await updateBookingCost(editingCostBooking.id, costInput, reasonInput);
      setEditingCostBooking(null);
    }
  };

  return (
    <div>
      <div className="flex gap-4 mb-6 border-b pb-2">
        <button 
          onClick={() => setActiveTab("overview")}
          className={`font-medium ${activeTab === "overview" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500"}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab("bookings")}
          className={`font-medium ${activeTab === "bookings" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500"}`}
        >
          Bookings
        </button>
        <button 
          onClick={() => setActiveTab("members")}
          className={`font-medium ${activeTab === "members" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500"}`}
        >
          Members
        </button>
        <button 
          onClick={() => setActiveTab("blog")}
          className={`font-medium ${activeTab === "blog" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500"}`}
        >
          Blog & AI
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-slate-500 text-sm">Total Bookings</h3>
              <p className="text-3xl font-bold text-slate-800">{initialBookings.length}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-slate-500 text-sm">Total Members</h3>
              <p className="text-3xl font-bold text-slate-800">{members.length}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-slate-500 text-sm">Articles</h3>
              <p className="text-3xl font-bold text-slate-800">{blogPosts.length}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96">
            <h3 className="text-lg font-bold mb-4 text-slate-800">Booking & Revenue Trends (7 Days)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Legend />
                <Bar yAxisId="left" dataKey="bookings" name="Bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="revenue" name="Revenue (IDR)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === "bookings" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 text-sm font-medium text-slate-500">Pelanggan</th>
                <th className="px-6 py-3 text-sm font-medium text-slate-500">Layanan</th>
                <th className="px-6 py-3 text-sm font-medium text-slate-500">Tanggal</th>
                <th className="px-6 py-3 text-sm font-medium text-slate-500">Status</th>
                <th className="px-6 py-3 text-sm font-medium text-slate-500">Biaya</th>
                <th className="px-6 py-3 text-sm font-medium text-slate-500">Pembayaran</th>
                <th className="px-6 py-3 text-sm font-medium text-slate-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {initialBookings.map((b: any) => (
                <tr key={b.id}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{b.customerName}</div>
                    <div className="text-sm text-slate-500">{b.whatsapp}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-900">{b.serviceType}</div>
                    <div className="text-sm text-slate-500">{b.vehicleType}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(b.bookingDate).toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      b.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      b.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                      b.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">Rp {b.totalPrice?.toLocaleString('id-ID')}</span>
                      {(b.additionalCost > 0) && (
                        <span className="text-xs text-red-500">+Rp {b.additionalCost.toLocaleString('id-ID')} ({b.additionalCostReason})</span>
                      )}
                      <button 
                        onClick={() => {
                          setEditingCostBooking(b);
                          setCostInput(b.additionalCost || 0);
                          setReasonInput(b.additionalCostReason || "");
                        }}
                        className="text-xs text-blue-600 hover:underline mt-1 text-left"
                      >
                        Edit Biaya
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {b.paymentMethod ? (
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-slate-800 text-sm">{b.paymentMethod}</span>
                        {b.paymentProof && (
                          <a href={b.paymentProof} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">
                            Lihat Bukti
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={b.status}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                      className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-white text-slate-900 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Konfirmasi</option>
                      <option value="COMPLETED">Selesai</option>
                      <option value="CANCELLED">Batal</option>
                    </select>
                  </td>
                </tr>
              ))}
              {initialBookings.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Belum ada booking.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "members" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 text-sm font-medium text-slate-500">Nama</th>
                <th className="px-6 py-3 text-sm font-medium text-slate-500">WhatsApp</th>
                <th className="px-6 py-3 text-sm font-medium text-slate-500">Poin</th>
                <th className="px-6 py-3 text-sm font-medium text-slate-500">Bergabung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map((m: any) => (
                <tr key={m.id}>
                  <td className="px-6 py-4 font-medium text-slate-900">{m.name}</td>
                  <td className="px-6 py-4 text-slate-600">{m.whatsapp}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded font-bold text-sm">
                      {m.points} pts
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(m.createdAt).toLocaleDateString('id-ID')}
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Belum ada member.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "blog" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Generate Artikel AI</h3>
            <p className="text-sm text-slate-600 mb-6">
              Buat artikel tips perawatan kendaraan secara otomatis menggunakan Google Gemini AI.
            </p>
            
            <form action={aiAction} className="space-y-4">
              {aiState.success && (
                <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">
                  {aiState.message}
                </div>
              )}
              {aiState.error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
                  {aiState.error}
                </div>
              )}
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-1">Topik / Ide Artikel</label>
                <input 
                  type="text" 
                  name="topic" 
                  id="topic"
                  placeholder="Contoh: Cara merawat cat mobil di musim hujan"
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <AIGenerateButton />
            </form>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <h3 className="text-xl font-bold text-slate-800 mb-4">Artikel Terbaru</h3>
             <div className="space-y-4 max-h-96 overflow-y-auto">
               {blogPosts.map((post: any) => (
                 <div key={post.id} className="border-b pb-4 last:border-0">
                   <h4 className="font-bold text-slate-800">{post.title}</h4>
                   <p className="text-xs text-slate-500 mt-1">{new Date(post.createdAt).toLocaleDateString('id-ID')}</p>
                   <div 
                      className="text-sm text-slate-600 mt-2 line-clamp-3 prose prose-sm max-w-none" 
                      dangerouslySetInnerHTML={{ __html: post.content }} 
                   />
                 </div>
               ))}
               {blogPosts.length === 0 && (
                 <p className="text-slate-500 text-sm">Belum ada artikel.</p>
               )}
             </div>
          </div>
        </div>
      )}

      {/* Edit Cost Modal */}
      {editingCostBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Edit Tambahan Biaya</h3>
            <div className="mb-4 text-sm text-slate-600 bg-slate-50 p-3 rounded">
              <p>Pelanggan: <span className="font-medium text-slate-900">{editingCostBooking.customerName}</span></p>
              <p>Layanan: <span className="font-medium text-slate-900">{editingCostBooking.serviceType} ({editingCostBooking.vehicleType})</span></p>
              <p>Harga Dasar: <span className="font-medium text-slate-900">Rp {editingCostBooking.basePrice?.toLocaleString('id-ID')}</span></p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tambahan Biaya (Rp)</label>
                <input 
                  type="number"
                  value={costInput}
                  onChange={(e) => setCostInput(Number(e.target.value))}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Contoh: 50000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Keterangan / Alasan</label>
                <input 
                  type="text"
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Contoh: Kaca sangat kusam"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setEditingCostBooking(null)}
                className="flex-1 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveCost}
                className="flex-1 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
