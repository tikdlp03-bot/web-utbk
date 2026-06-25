// Data Soal UTBK
const daftarSoal = [
    { q: "Jika x + 5 = 12, berapakah nilai dari 3x - 2?", info: ["19", "21", "23", "25"], ans: 0 },
    { q: "Semua unggas bertelur. Buaya bertelur. Kesimpulan yang tepat adalah...", info: ["Buaya adalah unggas", "Unggas adalah buaya", "Buaya dan unggas sama", "Tidak dapat disimpulkan hubungan buaya dan unggas"], ans: 3 },
    { q: "Manakah kata yang penulisan ejaannya TIDAK BAKU?", info: ["Aktivitas", "Analisa", "Karier", "Apotek"], ans: 1 },
    { q: "Pola bilangan: 3, 6, 12, 24, ... Angka selanjutnya adalah...", info: ["30", "36", "48", "60"], ans: 2 }
];

let indeksSekarang = 0;
let jawabanUser = new Array(daftarSoal.length).fill(null); 
let statusRagu = new Array(daftarSoal.length).fill(false); 
let sisaWaktu = 300; // 5 Menit

// Membuat Grid Nomor di Kanan
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

// Update Warna Grid Berdasarkan Status
function perbaruiWarnaGrid() {
    daftarSoal.forEach((_, indeks) => {
        const elemenGrid = document.getElementById(`grid-no-${indeks}`);
        elemenGrid.classList.remove("active", "answered", "doubtful");

        if (indeks === indeksSekarang) {
            elemenGrid.classList.add("active");
        }

        if (statusRagu[indeks]) {
            elemenGrid.classList.add("doubtful"); 
        } else if (jawabanUser[indeks] !== null) {
            elemenGrid.classList.add("answered"); 
        }
    });
}

// Menampilkan Soal Aktif
function tampilkanSoal() {
    const soalAktif = daftarSoal[indeksSekarang];
    document.getElementById("current-num").innerText = indeksSekarang + 1;
    document.getElementById("question-text").innerText = soalAktif.q;

    for (let i = 0; i < 4; i++) {
        document.getElementById(`text-${i}`).innerText = soalAktif.info[i];
        document.getElementById(`opt-${i}`).classList.remove("selected");
    }

    if (jawabanUser[indeksSekarang] !== null) {
        document.getElementById(`opt-${jawabanUser[indeksSekarang]}`).classList.add("selected");
    }

    document.getElementById("ragu-checkbox").checked = statusRagu[indeksSekarang];
    perbaruiWarnaGrid();
}

// Logika Pilihan Jawaban
function pilihJawaban(indeksOpsi) {
    jawabanUser[indeksSekarang] = indeksOpsi;
    
    for (let i = 0; i < 4; i++) {
        document.getElementById(`opt-${i}`).classList.remove("selected");
    }
    document.getElementById(`opt-${indeksOpsi}`).classList.add("selected");

    perbaruiWarnaGrid();
}

function tentukanRagu() {
    const ceklis = document.getElementById("ragu-checkbox").checked;
    statusRagu[indeksSekarang] = ceklis;
    perbaruiWarnaGrid();
}

function lompatKeSoal(indeksTarget) {
    indeksSekarang = indeksTarget;
    tampilkanSoal();
}

function soalBerikutnya() {
    if (indeksSekarang < daftarSoal.length - 1) {
        indeksSekarang++;
        tampilkanSoal();
    }
}

function soalSebelumnya() {
    if (indeksSekarang > 0) {
        indeksSekarang--;
        tampilkanSoal();
    }
}

// Timer Hitung Mundur
const hitungMundur = setInterval(() => {
    let menit = Math.floor(sisaWaktu / 60);
    let detik = sisaWaktu % 60;
    
    detik = detik < 10 ? '0' + detik : detik;
    document.getElementById("time-display").innerText = `${menit}:${detik}`;
    
    sisaWaktu--;

    if (sisaWaktu < 0) {
        clearInterval(hitungMundur);
        selesaiUjian();
    }
}, 1000);

// Selesai Ujian
function selesaiUjian() {
    clearInterval(hitungMundur);
    
    let totalBenar = 0;
    jawabanUser.forEach((jawaban, indeks) => {
        if (jawaban === daftarSoal[indeks].ans) {
            totalBenar++;
        }
    });

    let skorAkhir = Math.round((totalBenar / daftarSoal.length) * 1000);

    document.getElementById("quiz-layout").classList.add("hidden");
    document.getElementById("timer").classList.add("hidden");
    
    document.getElementById("result-box").classList.remove("hidden");
    document.getElementById("score-text").innerText = skorAkhir;
}

// Jalankan fungsi awal saat file diload
bangunGridNomor();
tampilkanSoal();