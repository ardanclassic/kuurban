import { Calendar, Clock, MapPin } from "lucide-react";

export default function JadwalPage() {
  const events = [
    {
      title: "Malam Takbiran & Persiapan Akhir",
      date: "9 Dzulhijjah | Malam Hari",
      time: "19:30 - Selesai",
      location: "Musala Al Ukhuwah & Lapangan Belakang Musala Al Ukhuwah",
      desc: "Mari bersama-sama mengumandangkan takbir mengagungkan asma Allah! Di malam penuh berkah ini, panitia beserta warga bergotong-royong mendirikan tenda, menyiapkan area pemotongan, serta memastikan seluruh hewan kurban telah tiba dan beristirahat dalam kondisi yang nyaman. Kehadiran Anda untuk sekadar menyapa atau ikut membantu akan menjadi penyemangat yang luar biasa untuk kami!"
    },
    {
      title: "Shalat Idul Adha Bersama",
      date: "10 Dzulhijjah | Pagi Hari",
      time: "06:00 - 07:30",
      location: "Musala Al Ukhuwah",
      desc: "Mari awali hari kemenangan dengan penuh kesyahduan. Jamaah diimbau hadir lebih awal dengan membawa perlengkapan salat (sajadah) masing-masing. Disunnahkan untuk berangkat ke musala dengan berjalan kaki bersama keluarga sambil terus melantunkan takbir, tahmid, dan tahlil sepanjang jalan. Sebuah momen kebersamaan spiritual yang tak terlupakan!"
    },
    {
      title: "Penyembelihan Hewan Kurban",
      date: "10 Dzulhijjah | Pagi Hari",
      time: "08:00 - 10:00",
      location: "Lapangan Belakang Musala Al Ukhuwah",
      desc: "Puncak ibadah kurban. Prosesi penyembelihan akan dieksekusi secara cepat, tepat, dan syar'i oleh tim jagal profesional kami dengan prinsip ihsan. Bagi Bapak/Ibu shohibul kurban (pekurban), kami mengundang dengan sangat hormat untuk hadir dan menyaksikan langsung proses penyembelihannya sebagai bentuk penyempurnaan niat, ikhtiar, dan doa."
    },
    {
      title: "Pemotongan & Timbang Daging",
      date: "10 Dzulhijjah | Siang Hari",
      time: "09:00 - 14:00",
      location: "Tenda Panitia - Lapangan Belakang Musala Al Ukhuwah",
      desc: "Di sinilah letak keseruan dan kekompakan tim panitia diuji! Daging kurban akan diproses dengan teliti—mulai dari pemisahan tulang, pemotongan, penimbangan, hingga pengemasan. Sesi ini selalu diwarnai dengan semangat gotong royong dan canda tawa lelah yang lillah. Mohon doa restunya agar kami senantiasa diberikan kesehatan dan kelancaran!"
    },
    {
      title: "Distribusi Daging Kurban",
      date: "10 Dzulhijjah | Sore Hari",
      time: "14:00 - Selesai",
      location: "Tenda Panitia - Lapangan Belakang Musala Al Ukhuwah",
      desc: "Momen berbagi kebahagiaan yang dinanti akhirnya tiba! Paket-paket daging kurban yang telah siap akan didistribusikan secara langsung kepada warga dan saudara-saudara kita yang berhak (mustahik). Semoga setiap potong daging ini tidak hanya mengenyangkan, tetapi juga membawa senyuman dan keberkahan untuk kita semua."
    }
  ];

  return (
    <div className="space-y-12 py-8 max-w-2xl mx-auto">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600">
          <Calendar size={14} className="animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Jadwal Kegiatan</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight ">
          Rundown <span className="text-indigo-600">Acara</span>
        </h1>
        <p className="text-slate-600 font-medium">Timeline kegiatan Idul Adha dari malam takbiran hingga distribusi daging.</p>
      </div>

      <div className="relative border-l-2 border-indigo-100 ml-4 md:ml-12 space-y-0">
        {events.map((event, i) => (
          <div key={i} className="relative pl-5 md:pl-12 group">
            {/* Timeline dot - Posisi tepat di tengah-tengah tinggi item sebelah kanan */}
            <div className="absolute -left-[11px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-indigo-600 border-4 border-zinc-50 shadow-md group-hover:scale-125 transition-all z-10" />

            <div className="py-8 space-y-4 border-b border-slate-100 group-last:border-none">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{event.title}</h3>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3">
                  <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" /> {event.date}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" /> {event.time}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-indigo-600 bg-indigo-50/80 px-3 py-1 rounded-lg uppercase tracking-tight">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="w-full">{event.location}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm md:text-[15px] text-slate-500 leading-relaxed font-medium max-w-xl">
                {event.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
