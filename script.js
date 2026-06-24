// Database Soal (Kita tambah jadi 4 soal untuk contoh grid)
const quizData = [
    { question: "Jika x + 3 = 7, maka nilai dari 2x + 1 adalah...", options: ["7", "9", "11", "13"], correct: 1 },
    { question: "Semua mahasiswa memakai jaket almamater...", options: ["A", "B", "C", "D"], correct: 0 },
    { question: "Nilai dari 50% dari 200 adalah...", options: ["50", "100", "150", "200"], correct: 1 },
    { question: "Lanjutan pola bilangan: 2, 4, 8, 16, ...", options: ["20", "24", "32", "64"], correct: 2 }
];

let currentQuestionIndex = 0;
let userAnswers = new Array(quizData.length).fill(null); // Menyimpan jawaban user (null = belum dijawab)
let doubtfulAnswers = new Array(quizData.length).fill(false); // Menyimpan status ragu-ragu
let timeLeft = 120;

// Inisialisasi Grid Nomor di Sidebar
function createGrid() {
    const gridContainer = document.getElementById("question-grid");
    gridContainer.innerHTML = "";
    
    quizData.forEach((_, index) => {
        const button = document.createElement("button");
        button.innerText = index + 1;
        button.classList.add("grid-item");
        button.id = `grid-${index}`;
        button.onclick = () => jumpToQuestion(index);
        gridContainer.appendChild(button);
    });
}

function updateGridStatus() {
    quizData.forEach((_, index) => {
        const gridItem = document.getElementById(`grid-${index}`);
        gridItem.classList.remove("active", "answered", "doubtful");

        if (index === currentQuestionIndex) gridItem.classList.add("active");
        
        // Aturan Warna UTBK
        if (doubtfulAnswers[index]) {
            gridItem.classList.add("doubtful"); // Kuning mendominasi jika ragu
        } else if (userAnswers[index] !== null) {
            gridItem.classList.add("answered"); // Hijau jika diisi & tidak ragu
        }
    });
}

function loadQuiz() {
    if (currentQuestionIndex >= 0 && currentQuestionIndex < quizData.length) {
        const currentQuiz = quizData[currentQuestionIndex];
        document.getElementById("q-num").innerText = currentQuestionIndex + 1;
        document.getElementById("question-text").innerText = currentQuiz.question;
        
        document.getElementById("optA").innerText = currentQuiz.options[0];
        document.getElementById("optB").innerText = currentQuiz.options[1];
        document.getElementById("optC").innerText = currentQuiz.options[2];
        document.getElementById("optD").innerText = currentQuiz.options[3];

        // Reset & pasang status tombol pilihan yang sudah pernah dipilih
        resetOptionStyles();
        if (userAnswers[currentQuestionIndex] !== null) {
            document.getElementById(`btn-${userAnswers[currentQuestionIndex]}`).classList.add("selected");
        }

        // Pasang status checkbox ragu-ragu
        document.getElementById("doubtful-checkbox").checked = doubtfulAnswers[currentQuestionIndex];
        
        updateGridStatus();
    }
}

function selectAnswer(selectedIndex) {
    userAnswers[currentQuestionIndex] = selectedIndex;
    resetOptionStyles();
    document.getElementById(`btn-${selectedIndex}`).classList.add("selected");
    updateGridStatus();
}

function toggleDoubtful() {
    const isChecked = document.getElementById("doubtful-checkbox").checked;
    doubtfulAnswers[currentQuestionIndex] = isChecked;
    updateGridStatus();
}

function resetOptionStyles() {
    for (let i = 0; i < 4; i++) {
        document.getElementById(`btn-${i}`).classList.remove("selected");
    }
}

function jumpToQuestion(index) {
    currentQuestionIndex = index;
    loadQuiz();
}

function nextQuestion() {
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        loadQuiz();
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuiz();
    }
}

// Hitung Skor Akhir Saat Selesai
function calculateScore() {
    let finalScore = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === quizData[index].correct) {
            finalScore += 25; // 4 soal x 25 = nilai 100
        }
    });
    return finalScore;
}

function endQuiz() {
    clearInterval(countdown);
    document.getElementById("quiz-box").classList.add("hidden");
    document.getElementById("quiz-footer").classList.add("hidden");
    document.getElementById("sidebar-container").classList.add("hidden");
    document.getElementById("timer").classList.add("hidden");
    
    const resultBox = document.getElementById("result-box");
    resultBox.classList.remove("hidden");
    document.getElementById("score-text").innerText = `Total Skor Anda: ${calculateScore()}`;
}

// Timer
const countdown = setInterval(() => {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    document.getElementById("time").innerText = `${minutes}:${seconds}`;
    timeLeft--;
    if (timeLeft < 0) endQuiz();
}, 1000);

// Jalankan Pertama Kali
createGrid();
loadQuiz();