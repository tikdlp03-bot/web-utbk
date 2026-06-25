// ==========================================
// 1. DATA BANK SOAL UTBK (TES POTENSI SKOLASTIK)
// ==========================================
const daftarSoal = [
    { 
        q: "Jika x + 5 = 12, berapakah nilai dari 3x - 2?", 
        info: ["19", "21", "23", "25"], 
        ans: 0 
    },
    { 
        q: "Semua unggas bertelur. Buaya bertelur. Kesimpulan yang tepat adalah...", 
        info: ["Buaya adalah unggas", "Unggas adalah buaya", "Buaya dan unggas sama", "Tidak dapat disimpulkan hubungan buaya dan unggas"], 
        ans: 3 
    },
    { 
        q: "Manakah kata yang penulisan ejaannya TIDAK BAKU?", 
        info: ["Aktivitas", "Analisa", "Karier", "Apotek"], 
        ans: 1 
    },
    { 
        q: "Pola bilangan: 3, 6, 12, 24, ... Angka selanjutnya adalah...", 
        info: ["30", "36", "48", "60"], 
        ans: 2 
    }
];

// ==========================================
// 2. STATE / VARIABEL KONTROL SISTEM UJIAN
// ==========================================
let indeksSekarang = 0;
let jawabanUser = new Array(daftarSoal.length).fill(null); // Menyimpan indeks jawaban pilihan user (0-3)
let statusRagu = new Array(daftarSoal.length).fill(false); // Menyimpan status ragu-ragu (true/false)
let sisaWaktu = 300; // Durasi ujian dalam detik (5 Menit)

// ==========================================
// 3. FUNGSI NAVIGASI & KONTROL GRID NOMOR SOAL
// ==========================================

/**
 * Membuat kotak-kotak nomor soal di sidebar kanan secara dinamis berdasarkan jumlah soal
 */
function bangunGridNomor() {
    const gridBox = document.getElementById("number-grid");
    gridBox.innerHTML = "";
    
    daftarSoal.forEach((_, indeks) => {
        const tombolNomor = document.createElement("button");
        tombolNomor.innerText = indeks + 1;
        tombolNomor.classList.add("grid-item");
        tombolNomor.id = `grid-no-${indeks}`;
        tombolNomor.onclick = () => lompatKeSoal(indeks);
        gridBox.appendChild(tombolNomor);
    });
}

/**
 * Memperbarui warna indikator pada grid nomor berdasarkan status pengerjaan peserta
 */
function perbaruiWarnaGrid() {
    daftarSoal.forEach((_, indeks) => {
        const elemenGrid = document.getElementById(`grid-no-${indeks}`);
        if (!elemenGrid) return;

        // Bersihkan seluruh status class warna sebelum me-render ulang
        elemenGrid.classList.remove("active", "answered", "doubtful");

        // Beri border khusus jika nomor tersebut sedang dibuka oleh peserta
        if (indeks === indeksSekarang) {
            elemenGrid.classList.add("active");
        }

        // Penentuan warna indikator standar UTBK
        if (statusRagu[indeks]) {
            elemenGrid.classList.add("doubtful"); // Kuning (Ragu-ragu)
        } else if (jawabanUser[indeks] !== null) {
            elemenGrid.classList.add("answered"); // Hijau (Sudah diisi)
        }
    });
}

// ==========================================
// 4. LOGIKA INTERAKSI HALAMAN UJIAN
// ==========================================

/**
 * Menampilkan konten pertanyaan dan pilihan jawaban yang aktif saat ini
 */
function tampilkanSoal() {
    const soalAktif = daftarSoal[indeksSekarang];
    
    // Tampilkan nomor dan teks soal ke elemen HTML
    document.getElementById("current-num").innerText = indeksSekarang + 1;
    document.getElementById("question-text").innerText = soalAktif.q;

    // Render teks pada pilihan opsi A, B, C, D
    for (let i = 0; i < 4; i++) {
        document.getElementById(`text-${i}`).innerText = soalAktif.info[i];
        
        // Bersihkan efek seleksi hijau (selected) pada tombol opsi
        document.getElementById(`opt-${i}`).classList.remove("selected");
    }

    // Jika user sebelumnya sudah memilih jawaban di nomor ini, munculkan kembali warna hijaunya
    if (jawabanUser[indeksSekarang] !== null) {
        document.getElementById(`opt-${jawabanUser[indeksSekarang]}`).classList.add("selected");
    }

    // Sinkronisasi status checkbox Ragu-Ragu di HTML
    document.getElementById("ragu-checkbox").checked = statusRagu[indeksSekarang];

    // Perbarui peta warna nomor di sebelah kanan
    perbaruiWarnaGrid();
}

/**
 * Fungsi pemicu saat peserta mengeklik salah satu opsi jawaban
 * @param {number} indeksOpsi - Indeks pilihan yang diklik (0 untuk A, 1 untuk B, dst)
 */
function pilihJawaban(indeksOpsi) {
    jawabanUser[indeksSekarang] = indeksOpsi;
    
    // Berikan efek highlight hijau pada tombol yang baru saja diklik secara real-time
    for (let i = 0; i < 4; i++) {
        document.getElementById(`opt-${i}`).classList.remove("selected");
    }
    document.getElementById(`opt-${indeksOpsi}`).classList.add("selected");

    perbaruiWarnaGrid();
}

/**
 * Menentukan atau mengubah status ragu-ragu berdasarkan interaksi checkbox peserta
 */
function tentukanRagu() {
    const ceklis = document.getElementById("ragu-checkbox").checked;
    statusRagu[indeksSekarang] = ceklis;
    perbaruiWarnaGrid();
}

/**
 * Melompat ke nomor tertentu saat kotak nomor di bagian sidebar diklik
 */
function lompatKeSoal(indeksTarget) {
    indeksSekarang = indeksTarget;
    tampilkanSoal();
}

/**
 * Berpindah ke 1 nomor setelahnya (Tombol Selanjutnya)
 */
function soalBerikutnya() {
    if (indeksSekarang < daftarSoal.length - 1) {
        indeksSekarang++;
        tampilkanSoal();
    }
}

/**
 * Berpindah ke 1 nomor sebelumnya (Tombol Sebelumnya)
 */
function soalSebelumnya() {
    if (indeksSekarang > 0) {
        indeksSekarang--;
        tampilkanSoal();
    }
}

// ==========================================
// 5. ENGINE TIMER (HITUNG MUNDUR UJIAN)
// ==========================================
const hitungMundur = setInterval(() => {
    let menit = Math.floor(sisaWaktu / 60);
    let detik = sisaWaktu % 60;
    
    // Format agar jika detik di bawah angka 10, tetap menampilkan dua digit (misal: 09, 08)
    detik = detik < 10 ? '0' + detik : detik;
    document.getElementById("time-display").innerText = `${menit}:${detik}`;
    
    sisaWaktu--;

    // Paksa hentikan ujian jika waktu pengerjaan habis
    if (sisaWaktu < 0) {
        clearInterval(hitungMundur);
        selesaiUjian();
    }
}, 1000);

// ==========================================
// 6. KALKULASI SKOR & INTEGRASI BACKEND LOKAL
// ==========================================

/**
 * Mengakhiri ujian, menghitung nilai akhir, dan mengirimkan datanya ke database lokal Admin.
 */
function selesaiUjian() {
    // Hentikan fungsi interval hitung mundur agar tidak berjalan di latar belakang
    clearInterval(hitungMundur);
    
    // Hitung jumlah jawaban benar
    let totalBenar = 0;
    jawabanUser.forEach((jawaban, indeks) => {
        if (jawaban === daftarSoal[indeks].ans) {
            totalBenar++;
        }
    });

    // Kalkulasi skor akhir menggunakan skala kasar UTBK (0 - 1000)
    let skorAkhir = Math.round((totalBenar / daftarSoal.length) * 1000);

    // --- LOGIKA UTAMA: SINKRONISASI DAN KIRIM DATA BALIK KE ADMIN ---
    // 1. Ambil data sesi siapa akun peserta yang sedang login saat ini
    let pesertaAktif = JSON.parse(localStorage.getItem("pesertaAktif"));
    // 2. Ambil master data seluruh peserta yang dikelola oleh admin
    let databasePeserta = JSON.parse(localStorage.getItem("dataPeserta")) || [];

    if (pesertaAktif) {
        // 3. Telusuri database, cari username yang cocok, lalu ganti skor 0 menjadi skorAkhir pengerjaan kuis ini
        databasePeserta = databasePeserta.map(p => {
            if (p.user === pesertaAktif.user) {
                p.skor = skorAkhir;
            }
            return p;
        });
        
        // 4. Simpan kembali database yang datanya sudah diperbarui ke localStorage agar dashboard admin ikut ter-update
        localStorage.setItem("dataPeserta", JSON.stringify(databasePeserta));
    }
    // ---------------------------------------------------------------

    // Manipulasi tampilan UI: Sembunyikan layout ujian, munculkan kotak skor kelulusan
    document.getElementById("quiz-layout").classList.add("hidden");
    document.getElementById("timer").classList.add("hidden");
    
    document.getElementById("result-box").classList.remove("hidden");
    document.getElementById("score-text").innerText = skorAkhir;
}

// ==========================================
// 7. INISIALISASI ENGINE SAAT HALAMAN DIBUKA
// ==========================================
bangunGridNomor();
tampilkanSoal();