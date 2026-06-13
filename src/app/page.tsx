import Link from "next/link";
import { CheckCircle2, Sparkles, Star, ArrowRight } from "lucide-react";
import BookingForm from "@/components/BookingForm";
import Navbar from "@/components/Navbar";
const serviceData = [
  {
    category: "Pencucian Dasar",
    title: "Cuci Hidrolik",
    src: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2670&auto=format&fit=crop",
    description: "Pencucian menyeluruh hingga ke bagian kolong mobil dengan sistem hidrolik yang aman dan tekanan air yang pas untuk merontokkan kotoran bandel tanpa merusak cat.",
  },
  {
    category: "Perawatan Eksterior",
    title: "Poles Body",
    src: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2670&auto=format&fit=crop",
    description: "Menghilangkan baret halus, swirl marks, dan noda aspal. Mengembalikan kilau cat asli kendaraan Anda sehingga tampak seperti baru keluar dari showroom.",
  },
  {
    category: "Proteksi Maksimal",
    title: "Nano Coating",
    src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2670&auto=format&fit=crop",
    description: "Perlindungan cat maksimal menggunakan teknologi nano ceramic. Memberikan efek daun talas (hydrophobic) yang tahan lama, membuat mobil mudah dibersihkan dan tahan terhadap cuaca.",
  },
  {
    category: "Perawatan Menyeluruh",
    title: "Auto Detailing",
    src: "https://images.unsplash.com/photo-1549317336-206569e8475c?q=80&w=2670&auto=format&fit=crop",
    description: "Perawatan interior dan eksterior super mendetail. Membersihkan ruang mesin, sela-sela AC, jok mobil, hingga plafon agar mobil kembali segar dan wangi.",
  },
];

export default function Home() {

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-white pt-40 pb-32 lg:pt-48 lg:pb-40 overflow-hidden rounded-b-[3rem] shadow-sm">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-b from-blue-50 to-transparent blur-3xl opacity-70"></div>
          <div className="absolute top-[40%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-t from-indigo-50 to-transparent blur-3xl opacity-70"></div>
        </div>

        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8 max-w-2xl">
            <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 font-semibold text-sm rounded-full border border-blue-100 shadow-sm animate-pulse">
              ✨ Car Wash & Detailing Premium
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Kilau Sempurna <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Tanpa Kompromi.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-light">
              Layanan perawatan kendaraan terbaik di Purbalingga. Cepat, detail, dan menjamin mobil Anda tampil seperti baru keluar dari dealer.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="#booking" className="group px-8 py-4 bg-blue-600 text-white font-semibold rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3">
                Booking Sekarang
                <Sparkles className="w-5 h-5 group-hover:animate-spin" />
              </Link>
              <div className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 hover:border-blue-200 transition-colors">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Buka: 07:30 - 17:00
              </div>
            </div>
          </div>
          
          {/* Hero Image / Abstract Shape */}
          <div className="relative group">
             <div className="aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center border-4 border-white transform transition-transform duration-700 group-hover:-translate-y-2 group-hover:shadow-blue-900/20 group-hover:scale-[1.02]">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay group-hover:scale-110 transition-transform duration-1000"></div>
               <span className="relative z-10 text-white/90 text-2xl font-bold tracking-widest uppercase shadow-black drop-shadow-lg">Emir Harmonis</span>
             </div>
             {/* Floating Accent Cards */}
             <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-bounce" style={{ animationDuration: '3s' }}>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                   <CheckCircle2 className="w-6 h-6" />
                 </div>
                 <div>
                   <div className="font-bold text-slate-800">100%</div>
                   <div className="text-xs text-slate-500 font-medium">Garansi Kilap</div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 relative bg-slate-50">
        <div className="container mx-auto px-4 relative z-10 max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 font-bold text-sm rounded-full mb-4">
              Layanan Kami
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Kualitas <span className="text-blue-600">Terbaik</span></h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-lg">Solusi lengkap untuk menjaga kendaraan Anda tetap bersih, terawat, dan terlindungi setiap saat.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {serviceData.map((service, idx) => (
              <div key={idx} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 border border-slate-100 flex flex-col relative">
                {/* Image Section */}
                <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-100">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent z-10"></div>
                  <img src={service.src} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 group-hover:-rotate-1 transition-transform duration-700" />
                  
                  {/* Floating Category Badge */}
                  <div className="absolute top-6 left-6 z-20">
                    <span className="px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold rounded-full shadow-lg">
                      {service.category}
                    </span>
                  </div>

                  {/* Title Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 z-20">
                    <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight drop-shadow-md">{service.title}</h3>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-8 flex-1 flex flex-col justify-between bg-white relative">
                  <p className="text-slate-600 leading-relaxed mb-6 flex-1 text-[15px]">
                    {service.description}
                  </p>
                  
                  <Link href="#booking" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors group/link w-max">
                    Pesan Layanan
                    <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover/link:bg-blue-600 group-hover/link:text-white transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-24 bg-white rounded-[3rem] shadow-sm relative overflow-hidden mx-4 md:mx-10 mb-20 border border-slate-100">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Mulai <span className="text-blue-600">Reservasi</span></h2>
            <p className="text-slate-500 text-lg">Pesan jadwal cuci atau detailing Anda sekarang dan nikmati layanan prioritas tanpa antre.</p>
          </div>
          <div className="bg-slate-50/50 rounded-3xl p-4 sm:p-8 border border-slate-100 shadow-inner">
            <BookingForm />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="reviews" className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Apa Kata <span className="text-blue-600">Pelanggan Kami?</span></h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Lebih dari 1000+ pelanggan telah mempercayakan perawatan kendaraan mereka kepada Emir Harmonis.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <TestimonialCard 
              name="Budi Santoso"
              role="Pengusaha"
              review="Luar biasa bersih! Detailing di bagian interiornya sangat rapi. Mobil saya yang usianya sudah 5 tahun kembali terlihat seperti baru keluar dari showroom."
              rating={5}
              delay="0"
            />
            <TestimonialCard 
              name="Siti Rahma"
              role="Ibu Rumah Tangga"
              review="Pelayanannya cepat tapi tidak asal-asalan. Ruang tunggunya juga nyaman sekali. Sangat direkomendasikan untuk cuci mobil rutin di Purbalingga."
              rating={5}
              delay="150"
            />
            <TestimonialCard 
              name="Agus Pratama"
              role="Karyawan Swasta"
              review="Suka banget dengan hasil nano coating-nya. Efek daun talasnya beneran awet, nyuci mobil jadi jauh lebih gampang sekarang. Mantap Emir Harmonis!"
              rating={5}
              delay="300"
            />
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Kunjungi <span className="text-blue-600">Workshop Kami</span></h2>
          <p className="text-slate-500 mb-12 text-lg">Jl. Mayjen Sungkono Utara Samsat Purbalingga</p>
          <div className="aspect-[21/9] w-full max-w-5xl mx-auto bg-slate-200 rounded-3xl overflow-hidden shadow-xl border-4 border-white hover:shadow-2xl transition-shadow duration-500 group">
            {/* Embedded map placeholder */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15826.966442654314!2d109.35172271896796!3d-7.382806208975908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e655979bb3ce39d%3A0xe541c8dbd58fbb2f!2sPurbalingga%20Regency%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1716943891000!5m2!1sen!2sid" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale group-hover:grayscale-0 transition-all duration-700"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp */}
      <a 
        href="https://wa.me/6281234567890" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-2xl shadow-green-500/30 hover:scale-110 hover:bg-green-600 transition-all duration-300 z-50 flex items-center justify-center group"
      >
        <span className="font-bold px-2 group-hover:pr-4 transition-all">WhatsApp</span>
        <div className="absolute right-3 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
          💬
        </div>
      </a>
    </div>
  );
}

function TestimonialCard({ name, role, review, rating, delay }: { name: string, role: string, review: string, rating: number, delay: string }) {
  return (
    <div 
      className="p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 relative group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute -top-4 -right-4 text-8xl text-blue-50 opacity-50 group-hover:text-blue-100 group-hover:-rotate-12 transition-all font-serif leading-none">"</div>
      <div className="flex gap-1 mb-6">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-slate-600 mb-8 leading-relaxed relative z-10 italic">"{review}"</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold text-slate-900">{name}</h4>
          <p className="text-sm text-slate-500">{role}</p>
        </div>
      </div>
    </div>
  )
}
