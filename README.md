# 🧮 Telat Belajar Matematika

> Berusaha mengejar ketertinggalan belajar matematika secara praktis, membumi, dan relevan dengan dunia nyata.

Proyek open-source ini ditujukan untuk siapa saja yang merasa "tertinggal" dalam pelajaran matematika. Kurikulum di sini dirancang bukan sekadar untuk menghafal rumus atau menyelesaikan *task* di atas kertas, melainkan untuk memahami **akar konsep, logika komputasi, dan penerapannya di dunia nyata** melalui metode pembelajaran *Grounded Math*.

## 👨‍💻 Maintainer
* **milio48**
> peran maintainer saat eksekusi : Maintainer akan menjalankan coding agent menggunakan antigravity dengan perintah "Jalankan misi di prompt-drafts.md hanya untuk sd" atau "Eksekusi prompt-docs.md hanya untuk sd".

## 🛠️ Tech Stack & Alat
* **HTML5, CSS3, Vanilla JavaScript** (Tanpa framework berat, dirender murni di klien).
* **Tailwind CSS** (via CDN) untuk styling yang cepat dan responsif.
* **KaTeX** untuk merender penulisan rumus matematika yang rapi.
* **LLM Prompting** untuk otomatisasi *drafting* materi dan konversi HTML.

## 📂 Struktur Direktori

Proyek ini dipisahkan antara "Dapur Konten" (Markdown) dan "Hasil Publikasi" (HTML statis).

```text
/ (Root Directory)
├── README.md                 # Dokumentasi utama proyek
├── method_grounded_math.md   # Panduan & filosofi metode pembelajaran
├── index_1-6_sd.md           # Silabus materi SD (Diisi oleh maintainer)
├── index_7-9_smp.md          # Silabus materi SMP (Diisi oleh maintainer)
├── index_10-12_sma.md        # Silabus materi SMA (Diisi oleh maintainer)
├── prompt-drafts.md          # Instruksi LLM untuk menyusun materi Markdown
├── prompt-docs.md            # Instruksi LLM untuk konversi MD ke HTML statis
├── drafts/                   # Folder hasil eksekusi prompt-drafts.md
│   ├── 1.md        
│   ├── 7.md
│   └── 10.md
└── docs/                     # Folder hasil eksekusi prompt-docs.md (Dipublikasikan ke GitHub Pages)
    ├── 1.html                
    ├── 7.html
    └── 10.html
```

## 🚀 Workflow Pengembangan

Jika Anda ingin mereplikasi atau melanjutkan proyek ini, ikuti alur kerja berikut:
1. **Perencanaan:** Maintainer memetakan silabus di `index_1-6_sd.md`, `index_7-9_smp.md`, dan `index_10-12_sma.md`.
2. **Pabrik Konten:** Maintainer menjalankan instruksi dari `prompt-drafts.md` ke LLM untuk menghasilkan materi mentah, lalu menyimpannya di folder `drafts/`.
3. **Konversi Web:** Maintainer menjalankan instruksi dari `prompt-docs.md` beserta teks dari folder `drafts/` ke LLM untuk diubah menjadi antarmuka web interaktif, lalu menyimpannya di folder `docs/`.
4. **Deploy:** File di dalam folder `docs/` akan otomatis disajikan melalui GitHub Pages.
```