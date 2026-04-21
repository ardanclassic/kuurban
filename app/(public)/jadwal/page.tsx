import { Calendar, Clock, MapPin } from "lucide-react";

export default function JadwalPage() {
  const events = [
    {
      title: "Malam Takbiran & Persiapan Akhir",
      date: "9 Dzulhijjah | Malam Hari",
      time: "19:30 - Selesai",
      location: "Musala Al Ukhuwah / Lapangan",
      desc: "Menyiapkan tenda, peralatan potong, galian, dan pengkondisian hewan kurban yang sudah datang."
    },
    {
      title: "Shalat Idul Adha Bersama",
      date: "10 Dzulhijjah | Pagi Hari",
      time: "06:00 - 07:30",
      location: "Fasum Gunung Batu Permai",
      desc: "Mohon membawa sejadah masing-masing. Berangkat berjalan kaki sambil mengumandangkan takbir."
    },
    {
      title: "Penyembelihan Hewan Kurban",
      date: "10 Dzulhijjah | Pagi Hari",
      time: "08:00 - 11:30",
      location: "Area Potong Kurban Al Ukhuwah",
      desc: "Penyembelihan dilakukan oleh tim jagal profesional. Warga yang berkurban (Shohibul Kurban) dipersilakan menyaksikan."
    },
    {
      title: "Pemotongan & Timbang Daging",
      date: "10 Dzulhijjah | Siang Hari",
      time: "13:00 - 15:30",
      location: "Tenda Panitia",
      desc: "Daging dipotong kecil, ditimbang sesuai takaran, dan dikemas rapi. Panitia mohon doanya agar dilancarkan."
    },
    {
      title: "Distribusi Daging Kurban",
      date: "10 Dzulhijjah | Sore Hari",
      time: "15:30 - Selesai",
      location: "Wilayah Perumahan & Sekitarnya",
      desc: "Daging diantar langsung ke rumah warga dan mustahiq oleh perwakilan panitia."
    }
  ];

  return (
    <div className="space-y-12 py-8 max-w-2xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-black text-indigo-950 tracking-tight">Jadwal Rangkaian Acara</h1>
        <p className="text-slate-600 font-medium">Timeline kegiatan Idul Adha dari malam takbiran hingga distribusi daging.</p>
      </div>

      <div className="relative border-l-2 border-indigo-100 ml-4 md:ml-12 space-y-0">
        {events.map((event, i) => (
          <div key={i} className="relative pl-8 md:pl-12 group">
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
                    <MapPin className="w-3.5 h-3.5" /> {event.location}
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
