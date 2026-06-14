import Link from "next/link";
import { PRICING_MAP, VehicleType, ServiceType } from "@/lib/pricing";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Katalog Harga - Emir Harmonis Salon Kendaraan",
  description: "Daftar harga lengkap layanan salon mobil dan motor.",
};

function formatPrice(price: number | undefined) {
  if (!price) return "-";
  return `Rp ${price.toLocaleString('id-ID')}`;
}

export default function KatalogPage() {
  const motorTypes: VehicleType[] = ["Motor Kecil", "Motor Sedang", "Motor Besar"];
  const mobilTypes: VehicleType[] = ["Mobil Kecil", "Mobil Sedang", "Mobil Besar"];

  const motorServices: ServiceType[] = ["Cuci Hidrolik", "Poles Body & Wax", "Auto Detailing", "Nano Coating"];
  const mobilServices: ServiceType[] = ["Cuci Hidrolik", "Poles Body & Wax", "Auto Detailing", "Nano Coating", "Interior", "Jamur Kaca", "Ruang Mesin"];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      {/* Header */}
      <header className="bg-slate-900 text-white pt-36 pb-16 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Katalog Harga</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Transparan dan terjangkau. Temukan paket layanan terbaik untuk menjaga kendaraan Anda tetap mengkilap.
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16 space-y-20">
        
        {/* Salon Motor */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800">Salon Motor</h2>
            <p className="text-slate-500 mt-2">Harga pasti termurah untuk kendaraan roda dua Anda.</p>
          </div>
          
          <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-200">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-800">Layanan</th>
                  {motorTypes.map(type => (
                    <th key={type} className="px-6 py-4 font-bold text-slate-800">
                      {type}
                      <p className="text-xs font-normal text-slate-500 mt-1">
                        {type === 'Motor Kecil' && '(Beat, Vario, Supra)'}
                        {type === 'Motor Sedang' && '(NMAX, PCX, Aerox)'}
                        {type === 'Motor Besar' && '(Ninja 250, Moge)'}
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {motorServices.map(service => (
                  <tr key={service} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-700">{service}</td>
                    {motorTypes.map(type => (
                      <td key={`${type}-${service}`} className="px-6 py-4 text-slate-600 font-semibold">
                        {formatPrice(PRICING_MAP[type][service])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Salon Mobil */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800">Salon Mobil</h2>
            <p className="text-slate-500 mt-2">Perawatan premium untuk mobil kesayangan Anda.</p>
          </div>
          
          <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-200">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-800">Layanan</th>
                  {mobilTypes.map(type => (
                    <th key={type} className="px-6 py-4 font-bold text-slate-800">
                      {type}
                      <p className="text-xs font-normal text-slate-500 mt-1">
                        {type === 'Mobil Kecil' && '(Brio, Agya, Yaris)'}
                        {type === 'Mobil Sedang' && '(Avanza, HR-V, Civic)'}
                        {type === 'Mobil Besar' && '(Pajero, Fortuner, Alphard)'}
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mobilServices.map(service => (
                  <tr key={service} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-700">{service}</td>
                    {mobilTypes.map(type => (
                      <td key={`${type}-${service}`} className="px-6 py-4 text-slate-600 font-semibold">
                        {formatPrice(PRICING_MAP[type][service])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 mt-4 text-center">*Pengerjaan salon interior dilakukan tanpa lepas jok mobil.</p>
        </section>

        {/* CTA */}
        <div className="bg-blue-600 text-white rounded-3xl p-10 text-center shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Siap untuk membuat kendaraan Anda mengkilap?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Booking sekarang dan pilih jadwal yang paling sesuai untuk Anda. Dapatkan poin *loyalty* untuk setiap transaksi.
          </p>
          <Link href="/user">
            <button className="bg-white text-blue-600 font-bold py-4 px-10 rounded-full hover:bg-slate-100 transition shadow-lg transform hover:-translate-y-1">
              Booking Sekarang
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
