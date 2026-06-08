# Literary Word Frequency & Concordance Analyzer (LitFreq)
### Academic Digital Humanities Workbench for English Literature Students
**Fakultas Bahasa dan Seni (FBS) - Universitas Negeri Medan (UNIMED)**
*Course Assignment: Artificial Intelligence for English Language & Literary Works (UAS Project VI-A)*

---

## 📌 Deskripsi Aplikasi
**Literary Word Frequency & Concordance Analyzer (LitFreq)** adalah aplikasi analisis korpus sastra berbasis web (Digital Humanities) yang dirancang khusus untuk mahasiswa Sastra Inggris UNIMED. Aplikasi ini mempermudah analisis kuantitatif dan kualitatif terhadap teks puisi klasik, cerita pendek (cerpen), maupun kutipan novel, serta menyusun draf penulisan ilmiah berbentuk Bab Buku (Book Chapter) akademik standar APA 7th secara otomatis.

Aplikasi ini menggunakan algoritma **Natural Language Processing (NLP)** lokal di browser untuk pembersihan tanda baca, penghitungan token, stemming sufiks, klasifikasi jenis kata (POS Tagging), perhitungan kemudahan membaca (Readability), serta pembuatan indeks konkordansi KWIC (Keyword-in-Context) dan analisis asosiasi kata (N-Grams). Aplikasi ini juga memanfaatkan **Gemini AI** di server dengan sistem *high-quality deterministic fallback* untuk menjamin analisis hermenetika sastra kritis selalu berfungsi dengan lancar.

---

## 🌟 Fitur Utama Aplikasi (Terbaru & Diperbarui)
Aplikasi ini dibagi menjadi 2 workspace utama yang saling terhubung secara waktu nyata (real-time):

### 1. Workspace Corpus Analyst (Analisis Multi-Genre Sastra Tingkat Lanjut)
Kini Workspace Analisis Korpus telah diperluas ke dalam **6 Tab Workbench Akademik** yang canggih:

- **A. Counts & Suffix (Frekuensi Kata & Suffix Stemming)**
  - **Word Frequency Visualizer:** Grafik batang SVG dinamis yang secara interaktif memetakan kata-kata yang paling sering digunakan dalam korpus pilihan Anda. Up-to-date dengan pembatasan parameter hitungan kata (chart limit) dan pembuangan kata fungsional (stopwords).
  - **Stemming Sufiks:** Tabel infleksi kata yang menguraikan imbuhan akhir bahasa Inggris (seperti *-ing, -ed, -s, -ly, -er*) untuk melacak stemming morfologis pembelajaran bahasa.
  - **Scholastic CSV Exporter:** Ekspor langsung metriks frekuensi leksikal ke format spreadsheet (.csv) yang kompatibel dengan Microsoft Excel atau Google Sheets.

- **B. Word Associations (N-Grams & Asosiasi Kata)**
  - **Linguistic Clusters (Bigram & Trigram):** Analisis asosiasi kata bersebelahan yang berulang untuk menemukan pola sintaksis, motif retoris, dan kunci tematik yang kerap dilemparkan oleh pengarang.
  - **Dynamic Controls:** Slider interaktif untuk membatasi jumlah kluster kata yang tampil (5-30 frase) dan tombol beralih cepat untuk beralih antara Bigram (2 Kata) dan Trigram (3 Kata).
  - **Scholastic CSV Exporter:** Ekspor draf asosiasi kata ke draf data untuk lampiran bab buku ilmiah Anda.

- **C. Readability & POS (Tingkat Keterbacaan & Klasifikasi Kelas Kata)**
  - **Tiga Metrik Formula Readability:**
    - *Flesch Reading Ease Score:* Mengukur tingkat kemudahan pemahaman teks (dari klasifikasi korpus yang sangat mudah hingga sastra klasik abad 19 yang penuh kompleksitas sintaksis).
    - *Flesch-Kincaid Grade Level:* Mengonversi panjang kata dan kalimat ke dalam jenjang tahun studi formal pembaca.
    - *Gunning Fog Index:* Estimasi tingkat kesulitan struktural prosa berdasarkan rata-rata jumlah kosakata kompleks (memiliki 3 suku kata atau lebih).
  - **POS Grammatical Tagging (Distribusi Kelas Kata):** Dilengkapi penandaan leksikal (*Part-of-Speech*) terhadap Nouns (Kata Benda), Verbs (Kata Kerja), Adjectives (Kata Sifat), Adverbs (Kata Keterangan), dan Relational Stopwords.
  - **Visual Distribution Legend:** Stacked-bar horizontal warna-warni yang memperlihatkan proporsi kelas kata secara waktu-nyata lengkap dengan persentasenya.
  - **Hermeneutic Feedback Tips:** Catatan interpretatif otomatis berdasarkan rasio kata benda/kata sifat yang mendeteksi gaya penulisan (misal: gaya deaktif/deskriptif khas Romantisisme vs dramatisatif/aktif khas cerita Gothic).

- **D. Concordance (KWIC - Keyword-in-Context)**
  - Indeks konkordansi sejajar untuk mendeteksi cara penggunaan dan konotasi sebuah kata berdasarkan lingkungan kata-kata di sebelah kiri (*Left Context*) dan sebelah kanan (*Right Context*).
  - **Interactive Klik-Sumbu Teks:** Mahasiswa dapat mencari padanan konkordansi secara instan hanya dengan **mengklik kata apa saja langsung di lembar teks karya sastra** sebelah kiri.
  - **Scholastic CSV Exporter:** Ekspor hasil pencarian konkordansi ke format CSV untuk analisis kolokasi lanjut.

- **E. Mood & AI (Sentimen Karakteristik & Kritik Hermenetika AI)**
  - Menampilkan estimasi skor emosional (Sentiment Score) dan leksikalitas Type-Token Ratio (TTR).
  - **Gemini AI Critique:** Klik satu tombol untuk mengirim draf analisis sastra Anda ke API model bahasa besar Gemini AI untuk menerima kritik mendalam bergaya akademis.
  - **Robust Fallback:** Tersemat cadangan analisis hermenetika sastra kritis lokal jika sewaktu-waktu pemanggilan server mengalami gangguan jaringan atau kuota batas API terlampaui.

- **F. Side-by-Side (Studi Sastra Bandingan / Stylometric Comparator)**
  - **Komparasi Side-by-Side:** Bandingkan Korpus A (Utama) dengan Korpus B (Referensi) secara instan.
  - **Preset vs Custom Bin:** Anda dapat membandingkan korpus utama dengan preset puisi, cerpen, novel lainnya yang tersedia, atau mengaktifkan "Custom Bin" untuk menyalin teks perbandingan milik Anda sendiri secara manual.
  - **Stylometric Matrix:** Tabel komparasi kuantitatif yang membentangkan perbandingan tebal kata (Token), kekayaan kamus kosa kata (Vocabulary Types), Type-Token Ratio (TTR) teoretis, skor keterbacaan (Flesch), rasio kata benda/sifat, hingga nada emosi karya sastra, lengkap dengan kolom analisis selisih tren variasi gaya kepenulisan (variance trends).

---

### 2. Workspace Book-Chapter Draft Companion (Penyusunan Bab Buku)
Menghubungkan seluruh data statistik, hitungan N-Gram, metriks keterbacaan, dan pembagian kelas kata sastra di tab pertama ke dalam **10 Bab Laporan Akademik Terstruktur (Lengkap standar APA 7th)** secara real-time:
- **Bab 1:** Rencana desain, profil pengguna sasaran (*Zahwa Adelia Putri Damanik*), dan rumusan masalah.
- **Bab 2:** Landasan Teoretis (NLP, Tokenisasi, Corpus Linguistics) dan tabel rujukan akademis.
- **Bab 3:** Karakteristik Dataset, etika hak cipta, dan langkah pra-pemrosesan teks.
- **Bab 4:** Flowchart Arsitektur Sistem terlokalisasi.
- **Bab 5:** Potongan kode TypeScript untuk tokenisasi & algoritma ekstraksi kata.
- **Bab 6:** Matriks Validasi Pengujian Perangkat Lunak (8 kondisi uji ekstrim).
- **Bab 7:** Hasil Analisis Kuantitatif (TTR, Distribusi Frekuensi, Klasifikasi Emosional).
- **Bab 8:** Hasil Analisis Konkordansi KWIC, N-Grams, dan evaluasi keterbacaan (Readability).
- **Bab 9:** Perbandingan Ilmiah (Aplikasi Deterministik vs Chatbot General / ChatGPT).
- **Bab 10:** Catatan pengunaan kecerdasan buatan (*AI Prompts Journal*) & Refleksi Etis.

**Fitur Salin Utama:**
Cukup dengan sekali klik tombol **"Copy Full Book Chapter Draft (Markdown)"** di bagian atas laporan, seluruh isi draf laporan 10 bab ilmiah lengkap tersebut akan disalin ke clipboard Anda untuk langsung ditempel di aplikasi pengolah dokumen Anda (*Microsoft Word* atau *Google Docs*).

---

## 🛠️ Panduan Penggunaan Step-by-Step (Untuk Pemula)

### Langkah 1: Membuka Aplikasi & Menjelajah Antarmuka
1. Saat aplikasi pertama kali dimuat di browser Anda, perhatikan judul tab peramban Anda kini telah ditingkatkan menjadi **Literary Word Frequency & Concordance Analyzer** sehingga terlihat sangat formal dan profesional.
2. Di bagian atas halaman aplikasi, terdapat menu pilihan Tab:
   - **Corpus Analyst** (aktif secara default untuk menganalisis teks).
   - **Book-Chapter Draft (Q1-Q10)** (digunakan untuk menyalin tulisan UAS).

### Langkah 2: Mengimpor atau Memilih Teks Sastra (Puisi, Cerpen, atapun Novel)
1. Pada Workspace **Corpus Analyst**, perhatikan kolom sebelah kiri bawah: **LITERARY PIECE SELECTION**.
2. Anda memiliki dua pilihan:
   - **Gunakan Preset yang Terklasifikasi:** Klik pilihan drop-down. Karya sastra telah dikelompokkan menjadi **Puisi/Poetry** (Emily Dickinson, Shakespeare, Poe), **Cerita Pendek/Cerpen** (Edgar Allan Poe, Gilman), atau **Novel Excerpts** (Mary Shelley, Jane Austen). Pilih salah satu untuk pemuatan data teks instan.
   - **Uji Karya Tulis Sendiri:** Klasifikasikan karya Anda secara manual dengan mengklik kotak centang **"Enable Custom Text Input Mode"** dan salin teks Anda pada kolom textarea yang tersedia.

### Langkah 3: Menganalisis Frekuensi Kata (Word Frequency)
1. Buka tab **Counts & Suffix**. Filter kata-kata fungsional bahasa Inggris biasa dengan mencentang kotak **"Filter functional English stopwords"** agar hanya kata substantif sastra yang diproses.
2. Analisis grafik SVG, daftar matriks kata terbanyak, dan penguraian sufiks kata di kolom bawah.
3. Klik tombol **"Download CSV"** untuk mengekstrak draf leksikal frekuensi Anda ke lampiran karya ilmiah.

### Langkah 4: Menganalisis Asosiasi Kluster Kata (N-Grams)
1. Pindah ke tab **Word Associations**.
2. Pilih beralih opsi button **Bigrams (2 Words)** atau **Trigrams (3 Words)** untuk menyisir pengulangan frase kata ganda atau tiga sejajar.
3. Atur slider pembatasan matches untuk menyesuaikan estetika bagan progres bar persentase frekuensi.

### Langkah 5: Membaca Metrik Keterbacaan & Jenis Kata (Readability & POS)
1. Klik tab **Readability & POS**.
2. Perhatikan nilai skor metrik keterbacaan teks (Flesch & Gunning Fog) lengkap dengan tahun/grade kecocokan jenjang pendidikan formal pembaca.
3. Amati diagram warna stacked horizontal proporsi kelas kata untuk melihat keseimbangan komposisi kata benda pembangun citra visual visualisasi atau kata kerja pembangun dinamika fiksi naratif.

### Langkah 6: Studi Sastra Bandingan (Side-by-Side Compare)
1. Pindah ke tab **Side-by-Side**.
2. Pilih karya sastra referensi pembanding pilihan Anda pada drop-down yang tersedia, atau centang panel **"Custom Bin"** untuk menempelkan naskah sastra referensi luar kustom milik Anda sendiri.
3. Pelajari draf tabel stylometric secara side-by-side. Selidiki perbedaan Type-Token Ratio (TTR) dan tingkat kesulitan keterbacaan teks dalam kacamata linguistik komparatif akademik.

### Langkah 7: Menyusun dan Menyalin Laporan Akhir UAS (Book Chapter)
1. Setelah Anda puas menganalisis teks, gulir ke atas dan klik Tab **Book-Chapter Draft (Q1-Q10)**.
2. Sistem telah menyinkronkan seluruh hasil hitungan biner angka, daftar kata kunci terbanyak, emosional puisi/cerpen, judul karya, dan nama penulis studi kasus ke dalam **10 Bab Laporan Akademis**.
3. Klik tombol **"Copy Full Book Chapter Draft (Markdown)"** berwarna jernih di pojok kanan atas halaman laporan. Draf laporan siap ditempel (*Ctrl+V*) di Microsoft Word atau Google Docs.

---

## 💻 Informasi Pengembangan & Struktur Kode
Aplikasi ini dibangun menggunakan modul stack modern yang ringan dan kompatibel:
- **Frontend Framework:** React 18 dengan TypeScript untuk pengetikan tipe data yang aman (`src/types.ts`).
- **Styling UI:** Tailwind CSS untuk tata letak responsif, menggunakan estetika warna gading krim (*natural cream* - `#F8F5EE`) dan zaitun (*natural olive* - `#4F5D44`) Universitas Negeri Medan.
- **Ikon Antarmuka:** Lucide-React (`lucide-react`).
- **Pembersih Corpus & Kalkulator Linguistic:** Diimplementasikan secara modular pada file `/src/utils/nlp.ts` untuk pembersihan tanda baca, penghitungan suku kata (*syllable counter*), kalkulasi formula Flesch-Kincaid & Gunning Fog, parsing N-Grams berdimensi, dan pemilahan kelas kata (*POS breakdown dictionary mappings*).
- **Integrasi Server API:** Node Express (`server.ts`) menangani rute pemanggilan Gemini API secara aman tersembunyi tanpa mengekspos kunci API pada sisi browser (sesuai standar keamanan AI Studio).

---
*Selamat Menganalisis! Semoga Sukses dalam Menempuh Ujian Akhir Semester English Literature Department UNIMED.*
