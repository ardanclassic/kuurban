# Blueprint Proyek: Sistem Informasi Manajemen Kurban Perumahan

## 1. Visi & Target Audiens
- **Visi:** Mempermudah panitia dalam manajemen data dan memberikan transparansi penuh kepada warga terkait pelaksanaan kurban di lingkungan perumahan.
- **Target Audiens Utama:** Warga perumahan dan panitia yang didominasi oleh bapak-bapak/ibu-ibu (usia 40-60+ tahun) dengan tingkat literasi teknologi menengah ke bawah.
- **Prinsip Utama:** *Simplicity first*. Jangan paksa warga mengisi form panjang. Gunakan web sebagai papan informasi interaktif, dan jadikan WhatsApp sebagai jembatan eksekusi.

## 2. Pedoman UI/UX (User Interface & User Experience)
Karena mayoritas *user* adalah orang tua (gaptek):
1. **Tipografi Besar & Jelas:** Gunakan ukuran font yang besar (minimal 16px untuk body text) dengan kontras warna yang tajam (misal: teks hitam di background putih/terang).
2. **Tombol "Tap-Friendly":** Semua tombol aksi harus berukuran besar dan mudah ditekan menggunakan jempol di layar HP.
3. **Bahasa Membumi:** Hindari istilah teknis (seperti *Submit*, *Dashboard*, *Checkout*). Gunakan bahasa lokal/Islami yang familiar: "Lihat Sapi Tersedia", "Hubungi Panitia", "Detail Acara".
4. **Tanpa Login untuk Warga:** Warga tidak perlu membuat akun, mengingat password, atau verifikasi email. Buka web -> langsung lihat info.

## 3. Alur Kerja (Workflow) yang Disederhanakan -> Pendekatan "Web-to-WA"

Berdasarkan kebiasaan warga yang suka lewat WA, alur pendaftarannya diubah dari sistem registrasi web murni menjadi *Hybrid*:

### A. Alur Pendaftaran Kurban (Warga)
1. **Lihat Web:** Warga membuka web dan melihat "Papan Sapi". Terlihat Sapi 1 (Penuh), Sapi 2 (Sisa 3 Slot).
2. **Pilih Sapi:** Warga menekan tombol besar **"Saya Ingin Gabung Sapi 2"**.
3. **Konfirmasi via WA (Otomatis):** Web akan langsung mengarahkan warga ke aplikasi WhatsApp milik Panitia (Pendaftaran) dengan membawa teks template otomatis:
   > *"Assalamu'alaikum Panitia, saya ingin mendaftar kurban untuk Sapi Kelompok 2. Mohon info nomor rekening, atas nama..."*
4. **Pembayaran & Verifikasi di luar web:** Warga transfer dan kirim bukti transfer langsung ke WA panitia tersebut.

### B. Alur Input Data (Panitia)
1. **Terima Chat:** Panitia menerima konfirmasi dan bukti transfer di WhatsApp.
2. **Input di Dashboard:** Panitia membuka halaman khusus admin (login dengan PIN/Password sederhana), lalu memasukkan nama shohibul kurban ke "Sapi Kelompok 2".
3. **Web Terupdate:** Web warga otomatis terupdate. "Sapi 2 sisa 2 slot", dan nama warga tersebut muncul di layar publik.

## 4. Fitur Inti (Minimum Viable Product - Tahap 1)

**Halaman Publik (Warga) - Mobile First:**
- **Hero Banner:** Hitung mundur (Countdown) Idul Adha & Ajakan berkurban.
- **Papan Kuota Sapi:** Tampilan kartu/grid yang jelas menampilkan slot sapi per kelompok.
- **Papan Kambing & Sapi Mandiri:** Daftar nama warga yang berkurban mandiri/kambing.
- **Jadwal & Info Acara:** Rangkaian acara dari penyembelihan hingga Shalat Ied.
- **Tombol Melayang (FAB):** Tombol WhatsApp "Tanya Panitia" yang selalu ada di pojok layar.

**Halaman Admin (Panitia) - Tablet/Desktop Friendly:**
- **Manajemen Partisipan:** Input, Edit, Hapus nama shohibul kurban. Setting status pembayaran (Lunas/Belum).
- **Keuangan Sederhana:** Catat Pemasukan (Kurban/Kas) dan Pengeluaran (Beli hewan, konsumsi jagal). (Fitur optional jika dirasa diperlukan)
- **Checklist Logistik / Timeline:** Daftar tugas kepanitiaan.

## 5. Keputusan Teknologi
- **Frontend:** Next.js (React) - Server Components untuk akses data yang cepat.
- **Styling:** Tailwind CSS - Untuk desain responsif dan premium.
- **Backend/Database:** Convex - Untuk manajemen autentikasi panitia dan realtime database kuota kurban. Menyediakan reaktivitas real-time out-of-the-box, serverless functions, dan mudah diintegrasikan dengan Next.js.
