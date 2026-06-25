// PROTEKSI: Mencegah masuk jika belum login
const cekPesertaAktif = localStorage.getItem("pesertaAktif");
if (!cekPesertaAktif) {
    alert("Akses ditolak! Silakan login terlebih dahulu.");
    window.location.href = "login.html";
}

const daftarSoal = [
    { q: "Jika x + 5 = 12, berapakah nilai dari 3x - 2?", info: ["19", "21", "23", "25"], ans: 0 },
    { q: "Semua unggas bertelur. Buaya bertelur. Kesimpulan yang tepat adalah...", info: ["Buaya adalah unggas", "Unggas adalah buaya", "Buaya dan unggas sama", "Tidak dapat disimpulkan"], ans: 3 },
    { q: "Manakah kata yang penulisan ejaannya TIDAK BAKU?", info: ["Aktivitas", "Analisa", "Karier", "Apotek"], ans: 1 },
    { q: "Pola bilangan: 3, 6, 12, 24, ... Angka selanjutnya adalah...", info: ["30", "36", "48", "60"], ans: 2 }
];

let indeksSekarang = 0;
let jawabanUser = new Array(daftarSoal.length).fill(null);
let statusRagu = new Array(daftarSoal.length).fill(false);
let sisaWaktu = 300; // 5 Menit

function bangunGridNomor() {
    const gridBox = document.getElementById("number-grid");
    gridBox.innerHTML = "";
    daftarSoal.forEach((_, indeks) => {
        const btn = document.createElement("button");
        btn.innerText = indeks + 1;
        btn.classList.add("grid-item");
        btn.id = `grid-no-${indeks}`;
        btn.onclick = () => { indeksSekarang = indeks; tampilkanSoal(); };
        gridBox.appendChild(btn);
    });
}

function perbaruiWarnaGrid() {
    daftarSoal.forEach((_, indeks) => {
        const el = document.getElementById(`grid-no-${indeks}`);
        if (!el) return;
        el.classList.remove("active", "answered", "doubtful");
        if (indeks === indeksSekarang) el.classList.add("active");
        if (statusRagu[indeks]) { el.classList.add("doubtful"); }
        else if (jawabanUser[indeks] !== null) { el.classList.add("answered"); }
    });
}

function tampilkanSoal() {
    const soal = daftarSoal[indeksSekarang];
    document.getElementById("current-num").innerText = indeksSekarang + 1;
    document.getElementById("question-text").innerText = soal.q;

    for (let i = 0; i < 4; i++) {
        document.getElementById(`text-${i}`).innerText = soal.info[i];
        document.getElementById(`opt-${i}`).classList.remove("selected");
    }
    if (jawabanUser[indeksSekarang] !== null) {
        document.getElementById(`opt-${jawabanUser[indeksSekarang]}`).classList.add("selected");
    }
    document.getElementById("ragu-checkbox").checked = statusRagu[indeksSekarang];
    perbaruiWarnaGrid();
}

function pilihJawaban(indeksOpsi) {
    jawabanUser[indeksSekarang] = indeksOpsi;
    for (let i = 0; i < 4; i++) document.getElementById(`opt-${i}`).classList.remove("selected");
    document.getElementById(`opt-${indeksOpsi}`).classList.add("selected");
    perbaruiWarnaGrid();
}

function tentukanRagu() {
    statusRagu[indeksSekarang] = document.getElementById("ragu-checkbox").checked;
    perbaruiWarnaGrid();
}

function soalBerikutnya() { if (indeksSekarang < daftarSoal.length - 1) { indeksSekarang++; tampilkanSoal(); } }
function soalSebelumnya() { if (indeksSekarang > 0) { indeksSekarang--; tampilkanSoal(); } }

const hitungMundur = setInterval(() => {
    let menit = Math.floor(sisaWaktu / 60);
    let detik = sisaWaktu % 60;
    document.getElementById("time-display").innerText = `${menit}:${detik < 10 ? '0' + detik : detik}`;
    sisaWaktu--;
    if (sisaWaktu < 0) { clearInterval(hitungMundur); selesaiUjian(); }
}, 1000);

function selesaiUjian() {
    clearInterval(hitungMundur);
    let benar = 0;
    jawabanUser.forEach((j, i) => { if (j === daftarSoal[i].ans) benar++; });
    let skorAkhir = Math.round((benar / daftarSoal.length) * 1000);

    // KIRIM NILAI KE DATABASE ADMIN LOKAL
    let pesertaAktif = JSON.parse(localStorage.getItem("pesertaAktif"));
    let databasePeserta = JSON.parse(localStorage.getItem("dataPeserta")) || [];

    if (pesertaAktif) {
        databasePeserta = databasePeserta.map(p => {
            if (p.user.toLowerCase() === pesertaAktif.user.toLowerCase()) p.skor = skorAkhir;
            return p;
        });
        localStorage.setItem("dataPeserta", JSON.stringify(databasePeserta));
    }

    document.getElementById("quiz-layout").classList.add("hidden");
    document.getElementById("timer").classList.add("hidden");
    document.getElementById("result-box").classList.remove("hidden");
    document.getElementById("score-text").innerText = skorAkhir;
    
    localStorage.removeItem("pesertaAktif"); // Hapus sesi setelah selesai
}

bangunGridNomor();
tampilkanSoal();