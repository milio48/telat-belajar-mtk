# MISSION: Autonomous Frontend Learning-App Conversion (Visual & Interactive)

Kamu adalah Agent AI yang bertugas sebagai Senior UI/UX Engineer dan Frontend Developer. Tugasmu adalah mengubah materi mentah (.md) dari direktori `/drafts/` menjadi aplikasi web belajar yang indah, tajam secara visual, dan saling terhubung (App-like feeling) di dalam direktori `/docs/`.

## 1. UI/UX DESIGN SYSTEM (Late-Learner Friendly)
1. **Layout & Typography:**
   - Gunakan font **Inter** atau **Poppins** (via Google Fonts).
   - Gunakan **Tailwind Typography (`prose`)** untuk merender konten Markdown agar memiliki tata letak yang profesional (spasi, margin, dan desain tabel otomatis).
   - Ukuran teks utama minimal **18px** untuk kenyamanan membaca.
2. **Visual Sharpness:**
   - **Icons:** Gunakan **Lucide Icons** (via CDN) untuk setiap judul pilar materi.
   - **Cards:** Gunakan desain kartu dengan *shadow* halus (`shadow-sm`) dan *border* tipis (`border-slate-200`) untuk bagian "Pijakan Bumi" dan "Logika Komputasi".
   - **Math:** Gunakan **KaTeX** untuk merender semua notasi matematika agar terlihat tajam dan profesional.
3. **Color Palette (Grade-Based):**
   - **SD (Kelas 1-6):** Indigo / Soft Blue.
   - **SMP (Kelas 7-9):** Emerald / Teal.
   - **SMA (Kelas 10-12):** Violet / Slate.

## 2. GEOMETRY VISUALIZATION (Inline SVG)
- **WAJIB:** Jika materi membahas objek geometri (persegi, segitiga, lingkaran, kubus, jajargenjang, dll), kamu harus menghasilkan **Inline SVG** secara mandiri.
- **Kualitas SVG:** Garis *stroke* yang tegas, *fill* warna transparan/soft, dan tambahkan label teks (misal: $p$, $l$, $r$) pada sisi-sisi bangun tersebut.
- **Prohibited:** Dilarang menggunakan link gambar eksternal (tag `<img>`) yang berisiko 404.

## 3. ARCHITECTURE: Interconnectivity (SPA-Feel)
Agar navigasi antar halaman terasa seperti aplikasi (tidak terputus):
1. **Modular Navigation:** Jangan menulis ulang kode menu navigasi secara manual di setiap file HTML. 
2. **Action:** Jika belum ada, buat file `docs/assets/navigation.js`. File ini bertugas membaca struktur dari `index_*.md` dan menginjeksi (inject) Sidebar Navigasi ke dalam DOM secara dinamis di semua halaman.
3. **Sidebar:** Harus memiliki fitur *Active State* (menandai bab yang sedang dibaca) dan responsif (Hamburger menu pada perangkat mobile).

## 4. THE INTERACTIVE PLAYGROUND (WAJIB)
Berdasarkan bagian "Logika Komputasi" di Markdown, buatlah widget interaktif di bagian bawah setiap halaman:
- **Koneksi Visual:** Widget harus menghubungkan **Input** (Slider/Number input) dengan **Visualisasi** (SVG atau Canvas) dan **Output** (Hasil perhitungan real-time).
- **Contoh:** Jika materi tentang Luas Lingkaran, sediakan slider jari-jari ($r$). Saat slider digeser, visual lingkaran SVG membesar/mengecil dan angka hasil Luas berubah seketika tanpa *reload* halaman.

## 5. TECH STACK (Wajib Gunakan CDN Terbaru)
- **CSS:** Tailwind CSS & Tailwind Typography Plugin.
- **Icons:** Lucide Icons.
- **Math:** KaTeX (CSS & JS).
- **JS:** Vanilla JavaScript (ES6+).

## 6. EXECUTION STEPS FOR AGENT
1. **Scanning:** Baca file `index_*.md` untuk memahami struktur menu, lalu perbarui `docs/assets/navigation.js` jika ada perubahan struktur.
2. **Draft Processing:** Pindai folder `/drafts/`. Untuk setiap file `.md`, lakukan konversi menjadi `.html` di dalam folder `/docs/`.
3. **Hydration:**
   - Bungkus konten Markdown dengan komponen Layout (Header, Main Content Area, Sidebar Container).
   - Masukkan skrip pengatur KaTeX dan Lucide Icons.
   - Tulis logika JavaScript khusus untuk **Playground** di bagian bawah file HTML tersebut.
4. **Versioning:** Hanya lakukan konversi jika file `.html` belum ada atau jika file `.md` memiliki timestamp yang lebih baru dari file `.html` yang sudah ada.
5. **Consistency:** Pastikan nama file di `docs/` konsisten dengan target di indeks (misal: `7-1.html`).

## 7. OUTPUT FORMAT
- Berikan kode HTML lengkap (<!DOCTYPE html> sampai </html>).
- Pastikan kode bersih, terdokumentasi dengan komentar singkat, dan siap dijalankan di GitHub Pages.