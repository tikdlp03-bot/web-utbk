// Database Soal UTBK Sederhana
const quizData = [
    {
        question: "Jika x + 3 = 7, maka nilai dari 2x + 1 adalah...",
        options: ["7", "9", "11", "13"],
        correct: 1 // Pilihan B (indeks ke-1)
    },
    {
        question: "Semua mahasiswa memakai jaket almamater. Sebagian orang di kampus bukan mahasiswa. Kesimpulannya adalah...",
        options: [
            "Sebagian orang di kampus tidak memakai jaket almamater",
            "Semua orang di kampus memakai jaket almamater",
            "Sebagian orang memakai jaket almamater",
            "Mahasiswa tidak memakai jaket almamater"
        ],
        correct: 0 // Pilihan A (indeks ke-0)
    }
];

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 120; // Waktu dalam detik (2 menit)

// Elemen HTML
const questionText = document.getElementById("question-text");
const qNum = document.getElementById("q-num");
const optA = document.getElementById("optA");
const optB = document.getElementById("optB");
const optC = document.getElementById("optC");
const optD = document.getElementById("optD");
const timerDisplay = document.getElementById("time");

// Fungsi Memuat Soal
function loadQuiz() {
    if (currentQuestionIndex < quizData.length) {
        const currentQuiz = quizData[currentQuestionIndex];
        qNum.innerText = currentQuestionIndex + 1;
        questionText.innerText = currentQuiz.question;
        optA.innerText = currentQuiz.options[0];
        optB.innerText = currentQuiz.options[1];
        optC.innerText = currentQuiz.options[2];
        optD.innerText = currentQuiz.options[3];
    } else {
        endQuiz();
    }
}

// Fungsi Memeriksa Jawaban
function checkAnswer(selectedIndex) {
    if (selectedIndex === quizData[currentQuestionIndex].correct) {
        score += 50; // Anggap 1 soal poinnya 50
    }
    nextQuestion();
}

// Lanjut ke Soal Berikutnya
function nextQuestion() {
    currentQuestionIndex++;
    loadQuiz();
}

// Fungsi Timer
const countdown = setInterval(() => {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    
    timerDisplay.innerText = `${minutes}:${seconds}`;
    timeLeft--;

    if (timeLeft < 0) {
        clearInterval(countdown);
        endQuiz();
    }
}, 1000);

// Mengakhiri Ujian
function endQuiz() {
    clearInterval(countdown);
    document.getElementById("quiz-box").classList.add("hidden");
    document.getElementById("quiz-footer").classList.add("hidden");
    document.getElementById("timer").classList.add("hidden");
    
    const resultBox = document.getElementById("result-box");
    resultBox.classList.remove("hidden");
    document.getElementById("score-text").innerText = score;
}

// Menjalankan kuis pertama kali saat halaman dibuka
loadQuiz();