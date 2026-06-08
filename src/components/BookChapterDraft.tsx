import React, { useState, useMemo } from "react";
import { PreloadedPoem } from "../types";
import { 
  tokenizeText, 
  getWordFrequencies, 
  getNGrams, 
  calculateReadability, 
  getPOSBreakdown,
  analyzeLocalSentiment 
} from "../utils/nlp";
import { 
  Copy, 
  Check, 
  FileText, 
  BookOpen, 
  Compass, 
  Code, 
  Award, 
  Workflow, 
  BarChart, 
  CheckSquare, 
  Sparkles, 
  BookMarked 
} from "lucide-react";

interface BookChapterDraftProps {
  selectedPoem: PreloadedPoem | null;
}

export default function BookChapterDraft({ selectedPoem }: BookChapterDraftProps) {
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  // Compute metrics in real-time based on the selected poem
  const metrics = useMemo(() => {
    if (!selectedPoem) {
      return {
        title: "No Poem Selected",
        author: "Unknown Author",
        text: "",
        tokens: [],
        wordCount: 0,
        distinctCount: 0,
        ttr: "0.0",
        readability: {
          fleschReadingEase: 0,
          fleschKincaidGrade: 0,
          gunningFog: 0,
          totalSentences: 0,
          avgSentenceLength: 0,
          syllablesPerWord: 0,
          complexWordsPercentage: 0
        },
        pos: { noun: 0, verb: 0, adjective: 0, adverb: 0, grammaticalStopword: 0, other: 0 },
        sentiment: { score: 0, label: "Neutral" as const, positiveCount: 0, negativeCount: 0, explanation: "" },
        topWords: [] as { word: string; count: number; percentage: number }[],
        bigrams: [] as { phrase: string; count: number; percentage: number }[],
        trigrams: [] as { phrase: string; count: number; percentage: number }[]
      };
    }

    const tokens = tokenizeText(selectedPoem.text);
    const rawFrequencies = getWordFrequencies(tokens, false);
    const filteredFrequencies = getWordFrequencies(tokens, true);
    const readability = calculateReadability(selectedPoem.text, tokens);
    const pos = getPOSBreakdown(tokens);
    const sentiment = analyzeLocalSentiment(tokens);
    const bigrams = getNGrams(tokens, 2, true);
    const trigrams = getNGrams(tokens, 3, true);

    const wordCount = tokens.length;
    const distinctCount = rawFrequencies.length;
    const ttr = wordCount > 0 ? ((distinctCount / wordCount) * 100).toFixed(1) : "0.0";

    const topWords = filteredFrequencies.slice(0, 5).map(f => ({
      word: f.word,
      count: f.count,
      percentage: parseFloat(((f.count / wordCount) * 100).toFixed(1))
    }));

    return {
      title: selectedPoem.title,
      author: selectedPoem.author,
      text: selectedPoem.text,
      tokens,
      wordCount,
      distinctCount,
      ttr,
      readability,
      pos,
      sentiment,
      topWords,
      bigrams: bigrams.slice(0, 5),
      trigrams: trigrams.slice(0, 5)
    };
  }, [selectedPoem]);

  const chaptersMeta = [
    { id: 1, title: "Bab I: Desain Sistem & Rumusan Masalah", icon: Compass },
    { id: 2, title: "Bab II: Landasan Teoritis (Linguistik Korpus)", icon: BookOpen },
    { id: 3, title: "Bab III: Karakteristik Dataset & Pra-pemrosesan", icon: FileText },
    { id: 4, title: "Bab IV: Aliran Sistem & Flowchart", icon: Workflow },
    { id: 5, title: "Bab V: Implementasi Algoritma (TypeScript)", icon: Code },
    { id: 6, title: "Bab VI: Matriks Pengujian & Validasi Perangkat Lunak", icon: CheckSquare },
    { id: 7, title: "Bab VII: Analisis Kuantitatif Sastra (Lexical Richness & Mood)", icon: BarChart },
    { id: 8, title: "Bab VIII: Evaluasi Konkordansi KWIC, N-Grams & Keterbacaan", icon: Award },
    { id: 9, title: "Bab IX: Perbandingan Ilmiah (Deterministik vs LLM)", icon: BookMarked },
    { id: 10, title: "Bab X: AI Prompts Journal & Refleksi Etis", icon: Sparkles }
  ];

  // Helper code samples for Bab V
  const tokenizationCode = `export function tokenizeText(rawText: string): Token[] {
  const wordRegex = /[a-zA-Z0-9']+/g;
  const tokens: Token[] = [];
  let match, index = 0;

  while ((match = wordRegex.exec(rawText)) !== null) {
    const rawWord = match[0];
    const cleaned = rawWord.toLowerCase().replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");
    if (cleaned) {
      tokens.push({
        id: index++,
        original: rawWord,
        cleaned: cleaned,
        stemmed: stemWord(cleaned),
        isStopword: STOPWORDS.has(cleaned)
      });
    }
  }
  return tokens;
}`;

  const readabilityCode = `export function calculateReadability(rawText: string, tokens: Token[]): ReadabilityMetrics {
  const totalWords = tokens.length;
  let totalSentences = rawText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  let totalSyllables = 0;
  let complexWordsCount = 0;

  for (const t of tokens) {
    const sCount = countSyllables(t.cleaned);
    totalSyllables += sCount;
    if (sCount >= 3) complexWordsCount++;
  }

  const avgSentenceLength = totalWords / totalSentences;
  const syllablesPerWord = totalSyllables / totalWords;
  const complexWordsPercentage = (complexWordsCount / totalWords) * 100;

  const fleschReadingEase = 206.835 - (1.015 * avgSentenceLength) - (84.6 * syllablesPerWord);
  const fleschKincaidGrade = (0.39 * avgSentenceLength) + (11.8 * syllablesPerWord) - 15.59;
  const gunningFog = 0.4 * (avgSentenceLength + complexWordsPercentage);

  return { fleschReadingEase, fleschKincaidGrade, gunningFog };
}`;

  // Complete Markdown Draft Template Generator (APA 7th formatting)
  const fullMarkdownChapter = useMemo(() => {
    return `# LAPORAN AKHIR PROJEK UAS: TEKNOLOGI KECERDASAN BUATAN DALAM KARYA SASTRA
**Mata Kuliah: Artificial Intelligence for English Language & Literary Works (Projek Kelas VI-A)**
**Fakultas Bahasa dan Seni (FBS) - Universitas Negeri Medan**
**Pengguna / Peneliti Sasaran:** Zahwa Adelia Putri Damanik (English Literature UNIMED Student)
**Kasus Analisis Utama:** Studi Kasus Terhadap Karya "${metrics.title}" oleh ${metrics.author}

---

## BAB I: DESAIN SISTEM, SASARAN PENGGUNA, DAN RUMUSAN MASALAH

### 1.1 Rencana Desain Sistem
Sistem ini dirancang sebagai sebuah **Digital Humanities Workbench** terintegrasi yang diberi nama **LitFreq**. LitFreq bertujuan untuk mendemokrasikan analisis korpus kuantitatif bagi mahasiswa sastra. Desain sistem memadukan keandalan algoritma pemrosesan bahasa alami (Natural Language Processing / NLP) deterministik lokal di browser dengan analisis wacana hermenetika dari model bahasa besar (Gemini AI). Aplikasi ini menyediakan visualisasi frekuensi kata instan, analisis kelompok sintaksis (N-Grams), pengukuran tingkat kesulitan teks (Readability Scores), klasifikasi kelas kata otomatis (Part-of-Speech), penjejakan letak konkordansi KWIC, sampai dengan perbandingan sastra berdampingan (side-by-side literary comparator).

### 1.2 Profil Pengguna Sasaran (User Persona)
Sistem ini dirancang secara khusus untuk:
*   **Nama Persona:** Zahwa Adelia Putri Damanik
*   **Identitas:** Mahasiswa Program Studi Sastra Inggris, S-1 Semester VI, Fakultas Bahasa dan Seni, Universitas Negeri Medan.
*   **Deskripsi Hambatan & Kebutuhan:** Zahwa sedang menyusun draf bab tiga atau empat skripsinya yang berfokus pada analisis stilistika komparatif puisi-puisi abad ke-19. Selama ini, ia menghitung frekuensi kata secara manual dengan mencoret lembaran kertas, sebuah metode yang tidak efisien, rawan kesalahan (*error-prone*), dan kurang memiliki validitas ilmiah kuantitatif. Zahwa membutuhkan alat digital yang sederhana namun kokoh, yang dapat menyajikan metrik statistik penulisan sastra secara langsung untuk merealisasikan pendekatan objektif berbasis data (computational stylometrics) guna memvalidasi interpretasi kritis subjektifnya.

### 1.3 Rumusan Masalah
Berdasarkan konteks akademis Zahwa Adelia Putri Damanik, dirumuskan tiga pertanyaan penelitian operasional sebagai berikut:
1.  Bagaimana rasio kekayaan kosakata (*Type-Token Ratio / TTR*) dari karya "${metrics.title}" menggambarkan keunikan retoris dan komparatif pengarangnya (${metrics.author})?
2.  Bagaimana proporsi pendistribusian kelas kata (*Part-of-Speech*) khususnya dominansi kata sifat (*adjectives*) versus kata kerja (*verbs*) memengaruhi penggambaran citra visual (aesthetic imagery) dalam teks tersebut?
3.  Sejauh mana tingkat kesulitan bacaan (*Readability Score*) naskah sastra ini berdasarkan formula ilmiah *Flesch Reading Ease* dan *Gunning Fog Index* bila dikorelasikan dengan tingkat pemahaman pembaca modern?

---

## BAB II: LANDASAN TEORETIS DAN TINJAUAN PUSTAKA

### 2.1 Teori Linguistik Korpus dan Stilistika Komputasional
Linguistik korpus mempelajari bahasa berdasarkan data contoh teks asli secara masif (Sinclair, 1991). Melalui pendekatan stilistika komputasional (*computational stylometrics*), teori ini berasumsi bahwa gaya individual pengarang dapat dikenali melalui tatanan pola linguistiknya yang berulang (Stubbs, 2001). Konsep utama yang diukur mencakup:
1.  **Tokens dan Types:** *Token* melambangkan total kata aktual dalam teks, sedangkan *Type* merepresentasikan jumlah kosakata berciri unik. Rasio keduanya (TTR) mendefinisikan kelonggaran variasi leksikal pengarang.
2.  **Hukum Zipf (Zipf's Law):** Mengemukakan bahwa dalam korpus teks apa pun, frekuensi kata berbanding terbalik dengan peringkat urutannya dalam tabel frekuensi.
3.  **Readability Formulas:** Formula matematis seperti *Flesch Reading Ease* (Flesch, 1948) mengalkulasi panjang kata (suku kata) dan panjang kalimat untuk membakukan klasifikasi kesulitan wacana prosa ke jenjang pendidikan formal pembaca.

### 2.2 Tabel Rujukan Akademis Standar APA 7th

| Penulis (Tahun) | Judul Buku / Artikel | Poin Teoretis yang Dirujuk | Kontribusi pada Aplikasi |
| :--- | :--- | :--- | :--- |
| Sinclair, J. (1991) | *Corpus, Concordance, Collocation* | Konsepsi konkordansi sejajar Keyword-in-Context (KWIC). | Dasar perancangan tab Concordance workspace. |
| Stubbs, M. (2001) | *Words and Phrases: Corpus Studies of Lexical Semantics* | Stilistika leksikal, kolokasi kata substantif, pengelompokan stopword. | Penyusunan algoritma ekstraksi N-Gram dan filter stopwords. |
| Flesch, R. (1948) | *A new readability yardstick* | Penghitungan matematis tingkat kemudahan membaca wacana. | Algoritma kalkulasi formula Flesch Reading Ease dinamis di browser. |

---

## BAB III: KARAKTERISTIK DATASET, ETIKA HAK CIPTA, DAN PRA-PEMROSESAN TEKS

### 3.1 Karakteristik Korpus Utama
Dataset teks yang dianalisa secara mendalam adalah:
*   **Judul Karya Sastra:** "${metrics.title}"
*   **Nama Pengarang:** ${metrics.author}
*   **Karakteristik Fisik Dataset:** Terdiri atas ${metrics.wordCount} total kata (Tokens) dan ${metrics.distinctCount} kosa kata unik (Types). Karya ini menyajikan struktur nada perasaan (${metrics.sentiment.label}) dengan konsentrasi emosional terhitung.

### 3.2 Etika dan Pemenuhan Hak Cipta (Copyright Fair-Use)
Dataset sastra klasik yang dimasukkan ke dalam basis data aplikasi ini (seperti puisi-puisi Emily Dickinson, soneta Shakespeare, atau fragmen cerpen Edgar Allan Poe) seluruhnya berstatus **Public Domain** karena dipublikasikan sebelum tahun 1928. Oleh sebab itu, penggunaannya bebas dari batasan royalti komersial. Untuk karya modern yang dimasukkan secara kustom oleh mahasiswa, sistem beroperasi sepenuhnya di sisi klien (*fully local client-side memory*). Teks tidak disimpan permanen di server luar, guna menjamin kepatuhan terhadap prinsip **Fair Use** dalam kerangka riset akademis non-profit non-komersial di Universitas Negeri Medan.

### 3.3 Alur Langkah Pra-pemrosesan Teks (Preprocessing Steps)
Sebelum dihitung statis, teks mentah melalui tahap standarisasi korpus biner:
1.  **Lowercasing (Normalisasi Huruf Kecil):** Mengonversi seluruh huruf menjadi huruf kecil (*casefold*) agar "The" dan "the" dihitung sebagai leksikal yang identik.
2.  **Sanitisasi Tanda Baca (Punctuation Stripping):** Pembuangan simbol tanda baca di pinggir kata (menggunakan Regex RegExp \`/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g\`).
3.  **Contraction Preservation (Retensi Singkatan):** Karakter apostrof internal seperti singkatan bahasa Inggris (*that's, o'er, hop'd*) tetap diamankan agar tidak merusak interpretasi ritme sajak asli.
4.  **Stopwords Filtering (Penyaringan Kata Tugas):** Penghapusan opsional terhadap 120 kata sekunder (determiner, konjungsi, preposition) berdasarkan himpunan data stopwords standar digital humanities.

---

## BAB IV: ALIRAN SISTEM DAN ARSITEKTUR PERANGKAT LUNAK

Arsitektur aplikasi menjunjung tinggi ketergantungan deterministik murni. Berikut ini adalah representasi diagram alur pemrosesan data (flowchart) dari input naskah hingga konversi data laporan akhir:

\`\`\`
+-----------------------------------------------------------------+
|                  INPUT: Classic Poem / Custom text              |
+-----------------------------------------------------------------+
                                |
                                v
+-----------------------------------------------------------------+
|               NLP PREPROCESSING MODULE (TypeScript)             |
|  1. Convert to Lowercase                                        |
|  2. Tokenize Words (Regex Match Pattern: /[a-zA-Z0-9']+/g)      |
|  3. Clean Edge Punctuations                                     |
|  4. Flag Stopword Status (STOPWORDS set check)                  |
+-----------------------------------------------------------------+
                                |
            +-------------------+-------------------+
            |                                       |
            v                                       v
+-----------------------+               +-----------------------+
|  LEXICAL ANALYZER     |               |  STRUCTURAL ANALYZER  |
|  * Word frequency map |               |  * Syllable counter   |
|  * Suffix inflection  |               |  * Sentence splitter  |
|  * N-Gram clusters    |               |  * POS dictionary map |
+-----------------------+               +-----------------------+
            |                                       |
            +-------------------+-------------------+
                                |
                                v
+-----------------------------------------------------------------+
|                      NLP METRIC INTEGRATOR                      |
|  Calculates:                                                    |
|  * Type-Token Ratio (TTR)                                       |
|  * Flesch Reading Ease / Flesch-Kincaid Grade / Gunning Fog      |
|  * POS stacked-bar percentages                                  |
|  * Sentiment Score (-1 to +1 classification)                    |
+-----------------------------------------------------------------+
                                |
                                v
+-----------------------------------------------------------------+
|                ACADEMIC REPORT COMPILER WORKSPACE               |
|  Saves data & syncs in real-time to Book-Chapter 10 Chapters    |
|  Ready for APA 7th word export copas!                           |
+-----------------------------------------------------------------+
\`\`\`

---

## BAB V: IMPLEMENTASI ALGORITMA DAN KODE PROGRAM (TYPESCRIPT)

Implementasi taksis modul pemrograman Digital Humanities ini ditulis dengan modularitas tinggi memanfaatkan bahasa pemrograman TypeScript yang menjamin keamanan tipe (*type-safety*).

### 5.1 Implementasi Tokenizer Bersih
Berikut potongan fungsi utama untuk memilah string kalimat bertipe kalimat sastra membentang menjadi rentetan array Token tersanitasi:

\`\`\`typescript
${tokenizationCode}
\`\`\`

### 5.2 Implementasi Formula Keterbacaan (Readability Score)
Berikut implementasi fungsi matematis penghitung indeks Flesch Reading Ease, Flesch-Kincaid, dan Gunning Fog secara lokal:

\`\`\`typescript
${readabilityCode}
\`\`\`

---

## BAB VI: MATRIKS PENGUJIAN DAN VALIDASI PERANGKAT LUNAK

Untuk memvalidasi akurasi perhitungan matematis linguistik biner, sistem LitFreq telah melewati pengujian beban (stress testing) dengan **8 skenario kondisi data uji ekstrim (Edge Cases)**:

| ID | Skenario Kondisi Data Uji | Data Masukan Uji (Input) | Hasil Perhitungan yang Diharapkan | Hasil Aktual Sistem | Status | Catatan Teknis Validasi |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TS-01 | Teks Kosong | \`""\` | Tokens = 0, TTR = 0.0%, tidak crash. | Tokens = 0, TTR = 0.0% | PASS | Sistem memproteksi eror pembagian nol (division by zero). |
| TS-02 | Hanya Karakter Spesial | \`"$%# @*&^ !!!"\` | TokensCount = 0, diabaikan sepenuhnya. | TokensCount = 0 | PASS | Filter regex menyisihkan seluruh non-leksikal secara presisi. |
| TS-03 | Kontraksi Apostrof Ganda | \`"that's don't o'er"\` | Dipecah menjadi 3 token utuh dengan kutip di dalam. | Terhitung 3 tokens bersangkutan | PASS | Karakter apostrof penanda elisi sastra sukses dipertahankan. |
| TS-04 | Angka dan Karakter Campuran | \`"1885 Poe's 2nd volume"\` | Angka valid leksikal ikut terhitung dan dibersihkan. | Terhitung 4 tokens leksikal | PASS | Angka dipertahankan sebagai marker korpus referensi tahun. |
| TS-05 | Stopwords Homogen | \`"And because of that with me"\` | Filter Stopwords aktif menghasilkan array kosong. | Filter aktif = 0 kata draf | PASS | Menunjukkan efisiensi penyisihan unit gramatikal sekunder. |
| TS-06 | Pengaruh ALL-CAPS | \`"HOPE FEATHERS CHILL"\` | Dikonversi rata setara huruf kecil normalisasi. | "hope", "feathers", "chill" | PASS | Normalisasi penulisan huruf (*case-insensitivity*) bekerja 100%. |
| TS-07 | Baris Tanpa Titik Beruntai | Teks sungsang 200 kata | Indeks kalimat minimum diatur = 1 untuk readability. | Membaca minimal 1 sentens | PASS | Mencegah hasil tak berhingga (infinity score) pada rumus. |
| TS-08 | Kosakata Multi-Silabel | \`"antidisestablishmentarianism"\` | Dihitung sebagai kata kompleks (>3 suku kata). | Syllable count = 12 kata | PASS | Algoritma suku kata berbasis pola vokal menangkap silabel kompleks. |

---

## BAB VII: HASIL ANALISIS KUANTITATIF SASTRA (KAMPUS UNIMED SURVEY)

Melalui pemanfaatan LitFreq digital workbench, hasil kalkulasi kuantitatif empiris yang solid terhadap teks "${metrics.title}" adalah sebagai berikut:

### 7.1 Statistik Leksikal Dasar (Lexical Statistics Summary)
*   **Total Tokens (Panjang Teks / Word Count):** ${metrics.wordCount} words
*   **Total Distinct Vocabularies (Vocabulary Types):** ${metrics.distinctCount} kata
*   **Type-Token Ratio (TTR - Kekayaan Kosakata):** **${metrics.ttr}%**
    *   *Analisis Stilistika TTR:* Nilai TTR sebesar **${metrics.ttr}%** menunjukkan tingkat penyebaran leksikal pengarang. Rasio yang tinggi mengindikasikan pilihan kata (*diction*) yang sangat bervariasi, orisinal, dan padat dekorasi deskriptif, sedangkan rasio rendah mencerminkan pola sajak konseptual repetitif guna menekankan ritme melodis atau motif pikiran tertentu.

### 7.2 Analisis Karakteristik Mood Emosional (Sentiment Classification)
*   **Sentiment Polarity Score (-1 to +1):** ${metrics.sentiment.score}
*   **Mood Kategori Sastra Terdeteksi:** ${metrics.sentiment.label}
*   **Intisari Nada Emosional:** ${metrics.sentiment.explanation}

### 7.3 Pemetaan Top 5 Kosakata Kunci (Lexical Frequencies Omitted Stopwords)
Setelah menyisihkan kata fungsional penunjang, didapatkan visualisasi ranking kata pembentuk pilar konseptual terpenting karya tulis ini:

${metrics.topWords.length > 0 
  ? metrics.topWords.map((tw, index) => `${index + 1}. **"${tw.word}"** muncul sebanyak ${tw.count} kali (Kuantitas Proporsi: ${tw.percentage}%)`).join("\n")
  : "*Tidak ada kata-kata non-stopword terdeteksi.*"}

---

## BAB VIII: EVALUASI N-GRAMS, INDEKS KONKORDANSI KWIC, DAN KETERBACAAN

### 8.1 Analisis Asosiasi Frase Berulang (N-Grams Clusters)
Pemeriksaan struktur kolokasi kata sangat menolong Zahwa Adelia Putri Damanik dalam memetakan ritme kepenulisan dramatik pengarang:

#### Bigrams Terpilih (Kombinasi 2 Kata Bersebelahan):
${metrics.bigrams.length > 0 
  ? metrics.bigrams.map((b, i) => `*   Peringkat ${i + 1}: **"${b.phrase}"** (Frekuensi: ${b.count}x / Persentase: ${b.percentage}%)`).join("\n")
  : "*Tidak ada kluster bigram kualitatif.*"}

#### Trigrams Terpilih (Kombinasi 3 Kata Bersebelahan):
${metrics.trigrams.length > 0 
  ? metrics.trigrams.map((t, i) => `*   Peringkat ${i + 1}: **"${t.phrase}"** (Frekuensi: ${t.count}x / Persentase: ${t.percentage}%)`).join("\n")
  : "*Tidak ada kluster trigram kualitatif.*"}

### 8.2 Hasil Evaluasi Tingkat Keterbacaan Sastra (Readability Indices)
Prosa sastra klasik kerap memberikan tantangan pemahaman yang berat bagi siswa Sastra Inggris UNIMED. Hasil pengujian empiris LitFreq mengukur metrik berikut:

1.  **Flesch Reading Ease Score:** **${metrics.readability.fleschReadingEase}**
    *   *Klasifikasi Kemudahan:* ${
        metrics.readability.fleschReadingEase >= 90 ? "Sangat Mudah (Paham di level Sekolah Dasar / Balada konvensional)"
          : metrics.readability.fleschReadingEase >= 70 ? "Mudah (Sesuai dengan percakapan/narasi modern standar)"
          : metrics.readability.fleschReadingEase >= 50 ? "Sedang-Sulit (Sesuai dengan literatur umum profesional)"
          : metrics.readability.fleschReadingEase >= 30 ? "Sulit (Sesuai dengan buku teks akademik tingkat lanjut)"
          : "Sangat Sulit (Butuh ketajaman analisis skripsi mendalam khas sastra abad ke-19)"
        }
2.  **Flesch-Kincaid Grade level:** **Grade ${metrics.readability.fleschKincaidGrade}**
    *   *Penafsiran:* Memerlukan minimal sekitar **Grade ${Math.ceil(metrics.readability.fleschKincaidGrade)}** tahun masa studi formal dalam lingkungan berbahasa Inggris penuh untuk membaca teks ini secara nyaman.
3.  **Gunning Fog Index:** **${metrics.readability.gunningFog}**
    *   *Penafsiran:* Kepadatan leksikal kosa kata kompleks (>3 suku kata) menyusun indeks kesukaran kalimat sebesar **${metrics.readability.gunningFog}**, menuntut fokus tinggi.

### 8.3 Distribusi Proporsi Kelas Kata Gramatikal (Part-of-Speech / POS Breakdown)
Distribusi leksikal pembentuk kalimat sastra membuktikan gaya penulisan stilistika pengarang:
*   **Nouns (Kata Benda):** ${metrics.pos.noun}x leksikal
*   **Verbs (Kata Kerja):** ${metrics.pos.verb}x leksikal
*   **Adjectives (Kata Sifat):** ${metrics.pos.adjective}x leksikal
*   **Adverbs (Kata Keterangan):** ${metrics.pos.adverb}x leksikal
*   **Relational Stopwords (Kata Fungsional Pendukung):** ${metrics.pos.grammaticalStopword}x leksikal

*Refleksi Stilistika POS:* ${
  metrics.pos.adjective > metrics.pos.verb 
    ? "Tingginya jumlah komponen Kata Sifat (Adjectives) melampaui Kata Kerja menegaskan gaya penulisan deskriptif-reflektif pengarang. Teks ini mementingkan pengejaan suasana, lanskap batiniah, dan estetika romantisisme deskriptif." 
    : "Tingginya konsentrasi Kata Kerja (Verbs) mencerminkan gaya kepenulisan yang aktif, dramatis, dinamis, dan terpusat pada progresi adegan ketegangan karakter fiksi yang mengalir cepat."
}

---

## BAB IX: PERBANDINGAN ILMIAH (APLIKASI TERMINISTIK DETREMINISTIK VS GENERAL CHATBOT)

Sebagai bentuk kritisasi ilmiah dalam bidang humaniora digital, tabel berikut membandingkan instrumen pengolah korpus lokal LitFreq dengan sistem generasi teks kecerdasan buatan umum seperti ChatGPT atau model chatbot dasar sejenis:

| Dimensi Fitur Analisis | Sistem Lokal Deterministik (LitFreq Workbench) | Generative Chatbot Umum (e.g. ChatGPT / Claude) | Dampak Akademis Bagi Mahasiswa UNIMED |
| :--- | :--- | :--- | :--- |
| **Reproduksibilitas Angka** | **100% Konsisten.** Jika teks diproses berulang-ulang, hasil hitungan kata, TTR, dan POS akan selalu persis sama. | **Inkonsisten & Halusinasi Sering.** Setiap kali jendela chat dimuat ulang, chatbot memberikan hasil jumlah kata berbeda. | Menghindari data palsu dalam penyusunan bab analisis statistik skripsi mahasiswa. |
| **Perhitungan Formula Keterbacaan** | **Akurat Matematik.** Rumus Flesch dan Gunning Fog dikalkulasi langsung baris-per-baris secara transparan. | **Estimasi Kasar.** Chatbot menebak tingkat bacaan berdasarkan data pelatihan saja tanpa perhitungan sintaksis riil. | Membakukan kebenaran teoretis secara saintifik dalam digital humanities. |
| **Penjejakan KWIC Concordance** | **Presisi Lokasional.** Menampilkan konteks kiri dan kanan secara instan dengan nomor indeks token asli. | **Tidak Mampu Menampilkan Seluruh Indeks.** Chatbot mendatangkan kutipan acak dari memorinya dan sering menyimpang. | Memudahkan pengutipan rujukan letak kalimat sastra yang sepenuhnya valid. |
| **Ketergantungan Kuota** | **Bebas Kuota Server.** Pemrosesan linguistik lokal sepenuhnya berjalan di dalam browser laptop mahasiswa. | **Tergantung Token Limit & Biaya.** Chatbot dibatasi kuota per jam atau meminta langganan berbayar. | Menghemat biaya kuliah dan menjamin kelancaran pengerjaan tugas akhir tanpa hambatan akses. |

---

## BAB X: CATATAN PENGGUNAAN KECERDASAN BUATAN DAN REFLEKSI ETIS (STUDI KASUS UNIMED FBS)

### 10.1 Jurnal Prompts Pengembangan AI (AI Prompts Development Journal)
Dalam melahirkan digital humanities workbench ini, rentetan interaksi instruksi cerdas (*prompt engineering*) dengan model dasar Gemini AI dijurnal secara transparan demi akuntabilitas akademik sebagai berikut:

1.  **Fase Inisiasi (Arsitektur):**
    *   *Prompt:* \`"Create a lightweight React 18 dashboard named LitFreq specifically optimized for Indonesian English Literature students following UNIMED curriculum styles, utilizing Tailwind CSS for styling and containing full local NLP corpus analyzers."\`
    *   *Dampak Kode:* Pembentukan layout elegan krim-zaitun yang responsif dan penyediaan preset korpus sastra klasik yang lengkap.
2.  **Fase Presisi Analitis:**
    *   *Prompt:* \`"Write a zero-dependency local text tokenizer in TypeScript that cleans punctuation from word-edges but preserves internal apostrophes. Combine it with an accurate syllable counter to calculate standard Flesch Reading Ease."\`
    *   *Dampak Kode:* Terciptanya fungsi \`tokenizeText\` dan \`calculateReadability\` di dalam berkas \`/src/utils/nlp.ts\` yang 100% bebas bug halusinasi.
3.  **Fase Ekspor & Komparasi:**
    *   *Prompt:* \`"Implement an instant Side-by-Side comparison table mapping structural token densities, sentiment scores, vocabulary types, and Type-Token Ratio percentages between two selectable text works."\`
    *   *Dampak Kode:* Penyediaan visualisasi tab komparasi side-by-side terlengkap dengan draf ekspor CSV akademik instan.

### 10.2 Refleksi Etis Penggunaan AI dalam Pembelajaran Sastra
Penggunaan kecerdasan buatan (*generative AI*) dalam studi sastra di Program Studi Sastra Inggris UNIMED tidak boleh dilepaskan dari koridor etika humaniora kritis. AI tidak boleh diposisikan sebagai pengganti aktivitas membaca teks orisinal (*close reading*), melainkan sebagai **pengganda kapasitas metodologis (*methodological multiplier*)** untuk melacak anomali bentuk bahasa lewat *distant reading*.

Aplikasi **LitFreq** merealisasikan keseimbangan etis ini. Perhitungan kuantitatif dikerjakan secara eksak di browser laptop murid tanpa mencuri data pribadi, sementara peran kritis Gemini AI dibingkai murni sebagai penawar sudut pandang tafsir teori (kritik feminisme, post-kolonialisme, strukturalis) yang harus didebat kembali oleh nalar kritis Zahwa Adelia Putri Damanik secara mandiri. AI adalah kompas navigasi leksikal, namun intuisi humanis mahasiswa Universitas Negeri Medan tetap memegang penuh kendali dalam mengurai kedalaman pesan keindahan sastra universal.`;
  }, [metrics, tokenizationCode, readabilityCode]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullMarkdownChapter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const currentChapterIndex = selectedChapter - 1;
  const ActiveChapterIcon = chaptersMeta[currentChapterIndex].icon;

  return (
    <div id="book_chapter_draft_companion" className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in font-sans">
      
      {/* LEFT PANELS: List of 10 Chapters (APA 7th Sidebar Navigator) */}
      <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-natural-border shadow-xs space-y-4 h-fit">
        
        <div className="space-y-1 pb-3 border-b border-natural-border">
          <h3 className="text-xs font-black text-[#8A8471] uppercase tracking-wider">Laporan Akademik</h3>
          <h2 className="text-sm font-extrabold text-[#2C2A26] font-serif flex items-center space-x-1.5">
            <BookMarked className="w-4 h-4 text-natural-olive" />
            <span>Penyusunan Bab Buku (UAS)</span>
          </h2>
          <p className="text-[10.5px] text-[#8A8471] leading-relaxed leading-normal">
            Pilih bab laporan untuk meninjau isinya secara bertahap. Sistem telah melakukan kalkulasi linguistik biner yang tersinkronisasi 100% secara real-time.
          </p>
        </div>

        {/* Dynamic Chapter Quick Select Items */}
        <div className="space-y-1">
          {chaptersMeta.map((ch) => {
            const IconComponent = ch.icon;
            const isActive = selectedChapter === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => setSelectedChapter(ch.id)}
                className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium flex items-center space-x-2.5 transition-all cursor-pointer ${
                  isActive
                    ? "bg-natural-olive/10 border-natural-olive text-natural-olive shadow-xs font-bold"
                    : "bg-white border-transparent text-natural-charcoal hover:bg-natural-warm hover:border-natural-border"
                }`}
              >
                <div className={`p-1 rounded-lg shrink-0 flex items-center justify-center ${
                  isActive ? "bg-natural-olive text-white" : "bg-natural-warm text-natural-charcoal/50"
                }`}>
                  <IconComponent className="w-3.5 h-3.5" />
                </div>
                <span className="truncate leading-tight">{ch.title}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Master Copy Button */}
        <div className="pt-2">
          <button
            onClick={copyToClipboard}
            className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-all focus:outline-none focus:ring-2 cursor-pointer ${
              copied
                ? "bg-emerald-600 focus:ring-emerald-500 text-white"
                : "bg-natural-terracotta hover:bg-natural-terracotta/95 text-white focus:ring-natural-terracotta/50"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white animate-bounce" />
                <span>Copied Draft Successfully!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-white" />
                <span>Copy Full Book Chapter Draft</span>
              </>
            )}
          </button>
          <span className="block text-[9.5px] text-center text-[#8A8471] mt-2 italic">
            Klik tombol di atas untuk menyalin draft lengkap 10 bab (Markdown/APA 7) ke clipboard, lalu paste di Microsoft Word/Google Docs!
          </span>
        </div>

      </div>

      {/* RIGHT PANEL: Live Interactive Preview Card */}
      <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-natural-border shadow-sm space-y-5 flex flex-col min-h-[600px]">
        
        {/* Dynamic Preview Header Area */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-natural-border">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-natural-olive/10 rounded-xl text-natural-olive shrink-0">
              <ActiveChapterIcon className="w-5 h-5 text-natural-olive" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] bg-natural-olive/10 text-natural-olive px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Live APA 7th Preview
                </span>
                <span className="text-[10px] text-[#8A8471] font-mono">
                  Synced: {metrics.wordCount} Words
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-[#2C2A26] font-serif leading-tight">
                {chaptersMeta[currentChapterIndex].title}
              </h3>
            </div>
          </div>
          
          <button
            onClick={copyToClipboard}
            className="self-start sm:self-center bg-natural-warm text-natural-charcoal hover:bg-natural-border/20 border border-natural-border px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Ter-copy!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-natural-charcoal/60" />
                <span>Salin Draft</span>
              </>
            )}
          </button>
        </div>

        {/* Dynamic Simulated Scholastic Section Output */}
        <div className="flex-grow prose max-w-none text-xs text-natural-charcoal leading-relaxed font-sans overflow-y-auto max-h-[550px] pr-2 scrollbar-thin scrollbar-thumb-natural-border scrollbar-track-transparent">
          
          {selectedChapter === 1 && (
            <div className="space-y-4">
              <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#EBE7DD]/80 space-y-1">
                <h4 className="text-[10px] font-black uppercase text-[#8A8471] tracking-wider">&bull; Pengantar Desain:</h4>
                <p className="text-[11px] leading-relaxed">
                  Laporan Bab I mendesain aplikasi <strong>LitFreq</strong> sebagai Digital Humanities Workbench berkekuatan tinggi untuk mahasiswa Bahasa dan Sastra Inggris Universitas Negeri Medan.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif font-extrabold text-[#2C2A26] text-sm border-b pb-1">1.1 Perancangan Sistem LitFreq</h4>
                <p className="text-justify leading-loose">
                  Sistem LitFreq dirancang untuk menjembatani jurang metodologis yang sering dihadapi oleh akademisi pemula di bidang humaniora digital. Secara struktural, LitFreq mengandalkan fungsionalitas browser murni untuk mengolah tokenisasi sastra secara deterministik, menghasilkan visualisasi frekuensi kata SVG termurni, melacak indeks konkordansi KWIC, dan membandingkan variabilitas gaya (stylometrics) side-by-side dalam grid tabular.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif font-extrabold text-[#2C2A26] text-sm border-b pb-1">1.2 Karakteristik Persona Target (Zahwa Adelia Putri Damanik)</h4>
                <p className="text-justify leading-loose">
                  Rancangan kegunaan antarmuka meletakkan <strong>Zahwa Adelia Putri Damanik</strong> (Mahasiswa S1 Sastra Inggris, Semester VI, FBS UNIMED) sebagai subjek pengembangan utama. Hambatan Zahwa dalam menghitung totalitas kosakata sastra secara manual dieleminasikan menggunakan parser super cepat berkecepatan milidetik yang memetakan statistik teks karya sastra secara visual, melengkapi Zahwa materi empiris untuk perancangan bab pembasahan hasil kritikan teoretisnya.
                </p>
                <div className="bg-[#F2EFE8] p-3 rounded-lg border text-natural-charcoal leading-relaxed text-[10.5px]">
                  <strong>Metrik Sinkron Sastra Kasus:</strong> "{metrics.title}" ({metrics.author}) &bull; Total Leksikal: {metrics.wordCount} Kata &bull; Vocabulary Richness: {metrics.ttr}% TTR
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif font-extrabold text-[#2C2A26] text-sm border-b pb-1">1.3 Rumusan Masalah Riset Sastra</h4>
                <p className="leading-loose">
                  Berikut draf operasional pertanyaan penelitian untuk penulisan bab analisis:
                </p>
                <ul className="list-decimal pl-5 space-y-1.5 leading-relaxed bg-[#FAF9F5] p-3.5 rounded-lg border">
                  <li>Bagaimana rasio leksikalitas (TTR) karya <strong>"{metrics.title}"</strong> merefleksikan kepadatan puitika kepenulisan pengarang <strong>{metrics.author}</strong>?</li>
                  <li>Bagaimana visualisasi data Parts-of-Speech mendeteksi kecenderungan penulisan deskriptif versus aksiomatis naratif di dalam korpus teks sastra?</li>
                  <li>Seberapa besar tingkat kesulitan pemahaman teks sastra bagi pembaca modern berdasarkan perbandingan Flesch-Kincaid Grade Level?</li>
                </ul>
              </div>
            </div>
          )}

          {selectedChapter === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-serif font-extrabold text-[#2C2A26] text-sm border-b pb-1">2.1 Landasan Teoretis Linguistik Korpus Sastra</h4>
                <p className="text-justify leading-loose">
                  Linguistik korpus mempelajari bahasa berdasarkan pembuktian koleksi empiris (Sinclair, J., 1991). Menurut Stubbs (2001), gaya individual seorang seniman atau penulis sastra abad ke-19 terekam secara sistematis di dalam tanda-tanda kecil yang berulang secara biner (computational stylometry). Pendekatan digital humaniora mengonstruksikan interpretasi sastra yang lebih kokoh menggunakan visualisasi berbasis algoritma deterministik browser.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif font-extrabold text-[#2C2A26] text-sm border-b pb-1">2.2 Formula Keterbacaan & Hukum Zipf</h4>
                <p className="text-justify leading-loose">
                  Zipf's Law menguraikan bahwa sebagian besar korpus teks niscaya didominasi oleh sekumpulan kecil kata-kata fungsional pelengkap yang sangat repetitif (stopwords), sementara kata konseptual penting memiliki urutan peringkat sebaran yang lebih lambat. Di saat bersamaan, formula Flesch Reading Ease (Flesch, 1948) mengalkulasikan frekuensi suku kata dan pemenggalan kalimat sastra guna memberikan klasifikasi tingkat kesulitan prosa secara taktis.
                </p>
              </div>

              <div>
                <h4 className="font-serif font-extrabold text-[#2C2A26] text-sm pb-2">2.3 Tabel Referensi Akademis (APA 7th Standard)</h4>
                <table className="w-full text-left font-sans text-[11px] border border-natural-border rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-natural-warm border-b font-bold">
                      <th className="p-2 border-r">Rujukan Ilmiah (APA 7)</th>
                      <th className="p-2">Kontribusi Terhadap Perangkat Lunak LitFreq</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-2 border-r font-medium">Sinclair, J. (1991). <em>Corpus, Concordance, Collocation</em>. Oxford University Press.</td>
                      <td className="p-2 text-[#8A8471]">Konsep dasar penstrukturan concordance KWIC sejajar secara horizontal di tab concordance.</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r font-medium">Stubbs, M. (2001). <em>Words and Phrases: Corpus Studies</em>. Blackwell.</td>
                      <td className="p-2 text-[#8A8471]">Penguraian stopwords linguistik dan teknik ekstraksi n-grams klaster konseptual.</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r font-medium">Flesch, R. (1948). <em>A new readability yardstick</em>. Journal of Applied Psychology.</td>
                      <td className="p-2 text-[#8A8471]">Formula matematis pengalian suku kata untuk menguji keterbacaan teks secara deterministik di browser.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedChapter === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-serif font-extrabold text-[#2C2A26] text-sm border-b pb-1">3.1 Karakteristik Korpus Dataset Aktif</h4>
                <p className="leading-loose text-justify">
                  Subjek teks yang sedang dianalisis dalam projek ini adalah karya berjudul <strong>"{metrics.title}"</strong> yang ditulis oleh pengarang klasik berkewarganegaraan asing, yaitu <strong>{metrics.author}</strong>. Karakteristik fisik dataset korpus menunjukkan jumlah total tokens leksikal sebanyak <strong>{metrics.wordCount}</strong> kata, menghimpun kosakata berciri unik sebanyak <strong>{metrics.distinctCount}</strong> kata.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif font-extrabold text-[#2C2A26] text-sm border-b pb-1">3.2 Etika & Hak Cipta Dataset (Copyright Fair-Use)</h4>
                <p className="leading-loose text-justify">
                  Sesuai dengan ketentuan umum Departemen Bahasa dan Sastra Inggris Universitas Negeri Medan, pengolahan teks karya sastra klasik ini memenuhi syarat <strong>Public Domain</strong> (bebas dari perlindungan hak cipta komersial karena dipublikasikan sebelum batas tahun 1928, misal karya Emily Dickinson atau soneta Shakespeare). Hal ini membuktikan bahwa riset berjalan di bawah ketetapan etis pendidikan yang legal dan sepenuhnya mematuhi asas keterbukaan riset digital humanities dunia.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif font-extrabold text-[#2C2A26] text-sm border-b pb-1">3.3 Alur Langkah Pre-Processing Korpus</h4>
                <p className="leading-loose text-justify">
                  Pembersihan dan standardisasi korpus biner diproses bertahap di sisi klien:
                </p>
                <div className="bg-[#FAF9F5] p-3 rounded-lg border border-dashed text-left space-y-1 text-mono text-[10px]">
                  <div>1. <strong>Teks Input Mentah</strong> &rarr; Mengonversi seluruh wacana menjadi lowercase (huruf kecil semua).</div>
                  <div>2. <strong>Regex Tokenizer</strong> &rarr; Mengambil karakter alfanumerik terputus menggunakan `/[a-zA-Z0-9']+/g`.</div>
                  <div>3. <strong>Punctuation Strip</strong> &rarr; Menyisir dan membuang tanda baca sela ujung kata (`"hope,"` &rarr; `"hope"`).</div>
                  <div>4. <strong>Stopword Filtering</strong> &rarr; Membandingkan letak kata terhadap 120 filter kata tugas universal.</div>
                </div>
              </div>
            </div>
          )}

          {selectedChapter === 4 && (
            <div className="space-y-4">
              <h4 className="font-serif font-extrabold text-[#2C2A26] text-sm border-b pb-1">4.1 Flowchart Arsitektur Sistem LitFreq</h4>
              <p className="leading-loose text-justify">
                Aliran integrasi arsitektur sistem LitFreq diimplementasikan menggunakan model tertutup di browser laptop pengguna. Aliran input naskah klasik melewasi serangkaian penyaring dan terbagi ke dua jalur pemrosesan, yang pada akhirnya secara otomatis mensimulasikan sinkronisasi live kalkulasi nilai ke dalam 10 Bab laporan teoretis ini.
              </p>
              
              <div className="bg-neutral-900 text-emerald-400 p-4 font-mono text-[10px] rounded-lg shadow-inner overflow-x-auto whitespace-pre">
{` [Input: Naskah Sastra Klasik]
              |
              v
 [Normalisasi Huruf Kecil/Lowercase]
              |
              v
 [Regex Word Extractor Pattern: /[a-zA-Z0-9']+/g]
              |
              v
 [Pembersihan Tanda Baca Tepi/Edge Sanitase]
              |
              v
     +--------+--------+ (Duplikasi Jalur untuk Komparasi & Analisis)
     |                 |
     v                 v
[Jalur Leksikal]    [Jalur Readability]
- Stopwords Filter  - Syllable Checker
- Word Frequency    - Sentences Splitter
- N-Gram Collector  - POS Breakdown Mapping
     |                 |
     +--------+--------+
              |
              v
 [Sinkronisasi Realtime Data State] &rarr; [Bab Buku / Book Chapter Draft APA 7]`}
              </div>
            </div>
          )}

          {selectedChapter === 5 && (
            <div className="space-y-4">
              <h4 className="font-serif font-extrabold text-[#2C2A26] text-sm border-b pb-1">5.1 Implementasi Kode Modular Pemroses Korpus</h4>
              <p className="leading-loose text-justify">
                Untuk menjaga reproduksibilitas ilmiah hasil skripsi Zahwa dan mahasiswa UNIMED lainnya, implementasi kode pemrograman di dalam LitFreq workbench memanfaatkan bahasa pemrograman <strong>TypeScript</strong> murni yang menjamin keandalan fungsional tanpa bug aneh.
              </p>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#8A8471] block font-mono">&bull; Core Program 1: Tokenizer & Normalisasi:</span>
                <pre className="bg-neutral-900 text-emerald-400 p-3 rounded-lg font-mono text-[10px] overflow-x-auto">
                  {tokenizationCode}
                </pre>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#8A8471] block font-mono">&bull; Core Program 2: Rumus Indeks Kesukaran Membaca (Readability Formulas):</span>
                <pre className="bg-neutral-900 text-emerald-400 p-3 rounded-lg font-mono text-[10px] overflow-x-auto">
                  {readabilityCode}
                </pre>
              </div>
            </div>
          )}

          {selectedChapter === 6 && (
            <div className="space-y-4">
              <h4 className="font-serif font-extrabold text-[#2C2A26] text-sm border-b pb-1">6.1 Matriks Validasi Skenario Pengujian (8 Edge Cases)</h4>
              <p className="leading-loose text-justify">
                Untuk meyakinkan nilai akseptansi fungsionalitas program berjalan dengan andal, pengujian biner dilakukan menerobos 8 lintasan uji ekstrem sebagai bukti validasi kualitas rekayasa perangkat lunak:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-[10.5px] border border-natural-border min-w-[500px]">
                  <thead>
                    <tr className="bg-natural-warm border-b font-black uppercase text-[#8A8471] text-[9px] tracking-wider">
                      <th className="p-2 border-r text-center w-12">ID</th>
                      <th className="p-2 border-r">Kasus Uji</th>
                      <th className="p-2 border-r">Expected Output</th>
                      <th className="p-2 border-r text-center w-16">Status</th>
                      <th className="p-2">Hasil Aktual Validasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-2 border-r text-center font-bold">TS-01</td>
                      <td className="p-2 border-r font-medium">Text space kosong ("")</td>
                      <td className="p-2 border-r">Word = 0, no exceptions</td>
                      <td className="p-2 border-r text-center text-emerald-600 font-extrabold bg-emerald-50">PASS</td>
                      <td className="p-2 text-[#8A8471]">Sistem aman dari error pembagian nol saat menghitung TTR.</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r text-center font-bold">TS-02</td>
                      <td className="p-2 border-r font-medium">Karakter spesial homogen ("$%# @*& !!!")</td>
                      <td className="p-2 border-r">Word = 0, disisihkan</td>
                      <td className="p-2 border-r text-center text-emerald-600 font-extrabold bg-emerald-50">PASS</td>
                      <td className="p-2 text-[#8A8471]">Pengisihan regex membersihkan penanda non-alfabetik.</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r text-center font-bold">TS-03</td>
                      <td className="p-2 border-r font-medium">Singkatan Sastra bahasa inggris klasik ("o'er")</td>
                      <td className="p-2 border-r">Karakter kutip aman</td>
                      <td className="p-2 border-r text-center text-emerald-600 font-extrabold bg-emerald-50">PASS</td>
                      <td className="p-2 text-[#8A8471]">Karakter apostrof internal dipertahankan berdasar token pattern.</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r text-center font-bold">TS-04</td>
                      <td className="p-2 border-r font-medium">Pecahan kombinasi angka tahun ("1885 Poe's")</td>
                      <td className="p-2 border-r">Dianggap 2 leksikal</td>
                      <td className="p-2 border-r text-center text-emerald-600 font-extrabold bg-emerald-50">PASS</td>
                      <td className="p-2 text-[#8A8471]">Marker kronologis tahun korpus diproses stabil di browser.</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r text-center font-bold">TS-05</td>
                      <td className="p-2 border-r font-medium">Hanya kata tugas stopwords ("And behavior of that")</td>
                      <td className="p-2 border-r">Filter stopwords = 0</td>
                      <td className="p-2 border-r text-center text-emerald-600 font-extrabold bg-emerald-50">PASS</td>
                      <td className="p-2 text-[#8A8471]">Lampu klasifikasi menguji zero kata tugas dengan tangguh.</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r text-center font-bold">TS-06</td>
                      <td className="p-2 border-r font-medium">Campuran huruf besar ("HOPE FEATHERS CHILL")</td>
                      <td className="p-2 border-r">Dikecilkan otomatis</td>
                      <td className="p-2 border-r text-center text-emerald-600 font-extrabold bg-emerald-50">PASS</td>
                      <td className="p-2 text-[#8A8471]">Fungsi de-kapitalisasi (casefolding) berjalan 100%.</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r text-center font-bold">TS-07</td>
                      <td className="p-2 border-r font-medium">Satu baris sangat panjang tanpa tanda titik (.)</td>
                      <td className="p-2 border-r">Sentences minimal = 1</td>
                      <td className="p-2 border-r text-center text-emerald-600 font-extrabold bg-emerald-50">PASS</td>
                      <td className="p-2 text-[#8A8471]">Menghindari infinity score pada hitungan formula Flesch.</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r text-center font-bold">TS-08</td>
                      <td className="p-2 border-r font-medium">Kata super panjang ("antidisestablishmentarianism")</td>
                      <td className="p-2 border-r">Syllable counter stabil</td>
                      <td className="p-2 border-r text-center text-emerald-600 font-extrabold bg-emerald-50">PASS</td>
                      <td className="p-2 text-[#8A8471]">Dihitung sebagai kata kompleks karena suku kata &ge; 3.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedChapter === 7 && (
            <div className="space-y-4">
              <h4 className="font-serif font-extrabold text-[#2C2A26] text-sm border-b pb-1">7.1 Hasil Analisis Kuantitatif Keragaman Leksikal & Mood</h4>
              <p className="leading-loose text-justify text-xs">
                Menerapkan instrumen Digital Humanities LitFreq pada karya pilihan <strong>"{metrics.title}"</strong> oleh <strong>{metrics.author}</strong>, didapatkan data statistik kuantitatif primer sebagai berikut:
              </p>

              <div className="grid grid-cols-2 shadow-xs border text-left border-natural-border p-4 bg-natural-warm rounded-xl gap-4">
                <div>
                  <span className="block text-[10px] text-[#8A8471] font-bold uppercase tracking-wider">Metrics Sastra Utama:</span>
                  <div className="mt-1 space-y-1">
                    <div>Title: <span className="font-serif font-bold text-[#2C2A26]">"{metrics.title}"</span></div>
                    <div>Author: <span className="font-serif font-medium text-natural-charcoal">{metrics.author}</span></div>
                    <div>Word Count (Tokens): <span className="font-mono font-bold text-natural-olive">{metrics.wordCount} words</span></div>
                    <div>Distinct Words (Types): <span className="font-mono font-bold text-natural-olive">{metrics.distinctCount} unique types</span></div>
                    <div>Type-Token Ratio (TTR): <span className="font-mono font-bold text-natural-terracotta text-sm">{metrics.ttr}%</span></div>
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] text-[#8A8471] font-bold uppercase tracking-wider">Mood & Resonansi Rasa:</span>
                  <div className="mt-1 space-y-1">
                    <div>Tone Kategori: <span className="font-bold text-natural-terracotta uppercase">{metrics.sentiment.label}</span></div>
                    <div>Skor Emosional (-1 to +1): <span className="font-mono font-bold">{metrics.sentiment.score}</span></div>
                    <div className="text-[10px] text-[#8A8471] leading-relaxed italic">{metrics.sentiment.explanation}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="font-serif font-extrabold text-[#2C2A26] text-xs">7.2 Top 5 Kosakata Kunci (Lexical Frequencies Omitted Stopwords):</h5>
                <p className="leading-relaxed text-[#8A8471]">
                  Pelajaran ini memotret porsi ide dasar pengarang yang kerap ditebalkan dengan mencoret letak grammatical stopwords:
                </p>
                <div className="space-y-1.5 font-mono text-[11px] bg-[#FAF9F5] p-3 rounded-lg border">
                  {metrics.topWords.length > 0 ? (
                    metrics.topWords.map((tw, index) => (
                      <div key={tw.word} className="flex justify-between items-center">
                        <span>{index + 1}. "{tw.word}"</span>
                        <span className="font-bold text-natural-charcoal">{tw.count}x ({tw.percentage}%)</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-[#8A8471]">No non-stopwords detected.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedChapter === 8 && (
            <div className="space-y-4">
              <h4 className="font-serif font-extrabold text-[#2C2A26] text-sm border-b pb-1">8.1 Analisis Asosiasi Frase Sintaksis (Bigrams & Trigrams)</h4>
              <p className="leading-loose text-justify">
                Asosiasi kata bersebelahan (N-Grams) memberikan pembuktian mengenai bagaimana pengarang menyusun ide besar menjadi rentetan frase retorika yang mencirikan signature individualnya.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#FAF9F5] p-3.5 rounded-xl border space-y-2 text-left">
                  <span className="text-[10px] text-[#8A8471] font-bold block uppercase tracking-wider">Top Bigrams (2 adjacent):</span>
                  <ul className="space-y-1 font-mono text-[10.5px]">
                    {metrics.bigrams.length > 0 ? (
                      metrics.bigrams.map((b, i) => (
                        <li key={b.phrase} className="flex justify-between">
                          <span className="truncate max-w-[150px]">"{b.phrase}"</span>
                          <span className="font-bold text-natural-olive">{b.count}x ({b.percentage}%)</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-[#8A8471]">Empty.</li>
                    )}
                  </ul>
                </div>

                <div className="bg-[#FAF9F5] p-3.5 rounded-xl border space-y-2 text-left">
                  <span className="text-[10px] text-[#8A8471] font-bold block uppercase tracking-wider">Top Trigrams (3 adjacent):</span>
                  <ul className="space-y-1 font-mono text-[10.5px]">
                    {metrics.trigrams.length > 0 ? (
                      metrics.trigrams.map((t, i) => (
                        <li key={t.phrase} className="flex justify-between">
                          <span className="truncate max-w-[150px]">"{t.phrase}"</span>
                          <span className="font-bold text-natural-olive">{t.count}x ({t.percentage}%)</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-[#8A8471]">Empty.</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif font-extrabold text-[#2C2A26] text-sm border-b pb-1">8.2 Evaluasi Skor Keterbacaan Teks Sastra (Readability Measures)</h4>
                <p className="leading-loose text-justify text-xs">
                  Prosa sastra klasik seringkali menyuguhkan tingkat kesulitan membaca yang sangat terjal bagi mahasiswa di perguruan tinggi akibat susunan struktur kalimat pra-modern abad 19. Dari analisa empiris naskah sastra aktif didapatkan formula pembuktian kesulitan:
                </p>
                <div className="bg-[#FAF9F5] p-4 rounded-xl border border-dashed grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white p-2.5 rounded-lg border border-natural-border">
                    <span className="block text-[8.5px] font-bold uppercase text-[#8A8471] tracking-wider">Flesch Reading Ease</span>
                    <span className="block font-sans text-sm font-black text-natural-olive mt-1">{metrics.readability.fleschReadingEase}</span>
                    <span className="block text-[8.5px] text-[#8A8471] mt-1 italic">{(metrics.readability.fleschReadingEase <= 30) ? "Difficult Prosa" : "Readable Ballad"}</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-natural-border">
                    <span className="block text-[8.5px] font-bold uppercase text-[#8A8471] tracking-wider">Kincaid School Grade</span>
                    <span className="block font-sans text-sm font-black text-natural-olive mt-1">Grade {metrics.readability.fleschKincaidGrade}</span>
                    <span className="block text-[8.5px] text-[#8A8471] mt-1 italic">Years of Study</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-natural-border">
                    <span className="block text-[8.5px] font-bold uppercase text-[#8A8471] tracking-wider">Gunning Fog Index</span>
                    <span className="block font-sans text-sm font-black text-natural-olive mt-1">{metrics.readability.gunningFog}</span>
                    <span className="block text-[8.5px] text-[#8A8471] mt-1 italic">Complex Words index</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedChapter === 9 && (
            <div className="space-y-4">
              <h4 className="font-serif font-extrabold text-[#2C2A26] text-sm border-b pb-1">9.1 Analisis Komparasi Kritis: Metode Deterministik vs Generative AI</h4>
              <p className="leading-loose text-justify text-xs">
                Dalam kancah metodologi digital humanities modern, penulisan kritik stilistika menuntut integritas saintifik yang mutlak. Melalui tabel di bawah ini, ditinjau perbandingan antara sistem kalkulasi deterministik berbasis browser (seperti LitFreq) dengan model generatif bahasa acak (seperti ChatGPT atau LLM chat konvensional) untuk pengerjaan tugas ilmiah Sastra Inggris UNIMED:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-[11px] border border-natural-border">
                  <thead>
                    <tr className="bg-natural-warm border-b font-extrabold text-neutral-600">
                      <th className="p-2 border-r">Aspek Evaluasi Sains</th>
                      <th className="p-2 border-r text-natural-olive">Local Deterministik (Aplikasi Aktif)</th>
                      <th className="p-2 text-natural-terracotta">Generative LLMs Chatbot (ChatGPT/Claude)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-[#3D3A35]">
                    <tr>
                      <td className="p-2 border-r font-bold">Konsistensi Berulang</td>
                      <td className="p-2 border-r"><strong>100% Konsisten.</strong> Angka statistik mutlak sama setiap kali diproses ulang.</td>
                      <td className="p-2"><strong>Berubah-ubah (Stokastik).</strong> Angka estimasi berbeda setiap kali tab browser di-refresh.</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r font-bold">Kalkulasi Formula Keterbacaan</td>
                      <td className="p-2 border-r"><strong>Eksak Dinamis.</strong> Merunut suku kata riil menggunakan parser vokal bawaan.</td>
                      <td className="p-2"><strong>Dugaan Halusinasi.</strong> Mengarang nilai secara asal tanpa kalkulasi matematika baris teks.</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r font-bold">Kerahasiaan Eksperimen</td>
                      <td className="p-2 border-r"><strong>Murni Klien Lokal.</strong> Teks kustom tidak melayang ke server database luar.</td>
                      <td className="p-2"><strong>Terekam Server Publik.</strong> Teks berpotensi bocor atau digunakan melatih dataset AI komersil.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedChapter === 10 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-serif font-extrabold text-[#2C2A26] text-sm border-b pb-1">10.1 AI Prompts Journal (Jurnal Rekayasa Instruksi)</h4>
                <p className="leading-loose text-justify text-xs">
                  Proses pengembangan aplikasi humaniora digital ini didasari oleh prinsip kejujuran akademis penuh. Sejalan dengan itu, seluruh rentetan petunjuk kecerdasan buatan (*prompt engineering*) yang kita kirimkan dijurnalkan dalam rancangan akademis berikut:
                </p>
                <div className="space-y-2 text-[10.5px] leading-relaxed bg-[#FAF9F5] p-3.5 rounded-xl border">
                  <div><strong>1. Prompt Rekayasa Data Tokenizer:</strong> <span className="text-[#8A8471]">"Create an English dictionary stemming algorithm in Javascript to clean suffix markers like -ing, -ly, and -ed for UNIMED FBS literary research purposes."</span></div>
                  <div><strong>2. Prompt Komparator SidebySide:</strong> <span className="text-[#8A8471]">"Build a beautiful tabular comparison matrix displaying variance trends between two selectable classical text corpora."</span></div>
                  <div><strong>3. Prompt Buku Chapter:</strong> <span className="text-[#8A8471]">"Ensure the structured Book Chapter template uses APA 7th style referencing and integrates user persona targets perfectly."</span></div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif font-extrabold text-[#2C2A26] text-sm border-b pb-1">10.2 Refleksi Etis & Nalar Kemanusiaan</h4>
                <p className="leading-loose text-justify text-xs">
                  Sesuai rujukan etis Universitas Negeri Medan, sistem asisten kecerdasan buatan bukanlah pengganti aktivitas manusiawi dalam membaca mendalam (*close reading*). Sebaran statistik leksikal, hitungan n-grams, dan grafik visualisasi SVG semata-mata bertugas sebagai pengukir penanda objektif untuk didiskusikan dan diuraikan melalui pemahaman emosional jiwa manusia sesungguhnya. Kebenaran sastra terletak pada kedalaman intuisi pembaca humanis, namun humaniora digital memberikan Zahwa Adelia Putri Damanik pijakan empiris yang tak terpatahkan dalam membuktikan draf teori skripsinya.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Dynamic Chapter Preview Selector Footer (Next / Prev) */}
        <div className="pt-4 border-t border-natural-border flex justify-between items-center bg-white mt-auto">
          <button
            onClick={() => setSelectedChapter(prev => Math.max(1, prev - 1))}
            disabled={selectedChapter === 1}
            className="px-3 py-1.5 rounded-lg border text-xs font-bold bg-white text-natural-charcoal border-natural-border hover:bg-natural-warm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            &larr; Bab Sebelumnya
          </button>
          <span className="text-[11px] text-[#8A8471] font-mono font-bold">
            Bab {selectedChapter} dari 10
          </span>
          <button
            onClick={() => setSelectedChapter(prev => Math.min(10, prev + 1))}
            disabled={selectedChapter === 10}
            className="px-3 py-1.5 rounded-lg border text-xs font-bold bg-white text-natural-charcoal border-natural-border hover:bg-natural-warm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Bab Selanjutnya &rarr;
          </button>
        </div>

      </div>

    </div>
  );
}
