const quizData = [
  { question: "Which movie features the quote 'May the Force be with you'?", options: ["Star Wars", "Star Trek", "Guardians of the Galaxy", "Avatar"], answer: "Star Wars" },
  { question: "Who played Jack in Titanic?", options: ["Leonardo DiCaprio", "Brad Pitt", "Tom Cruise", "Johnny Depp"], answer: "Leonardo DiCaprio" },
  { question: "Which movie won Best Picture in 2020 Oscars?", options: ["1917", "Joker", "Parasite", "Ford v Ferrari"], answer: "Parasite" },
  { question: "Who is the director of 'Inception'?", options: ["Christopher Nolan", "Steven Spielberg", "James Cameron", "Quentin Tarantino"], answer: "Christopher Nolan" },
  { question: "In which movie does the character 'Forrest Gump' appear?", options: ["Cast Away", "Forrest Gump", "Big", "The Green Mile"], answer: "Forrest Gump" },
  { question: "Which movie features a talking raccoon and a tree?", options: ["Guardians of the Galaxy", "Zootopia", "Ice Age", "Shrek"], answer: "Guardians of the Galaxy" },
  { question: "Who played the Joker in 'The Dark Knight'?", options: ["Heath Ledger", "Joaquin Phoenix", "Jack Nicholson", "Jared Leto"], answer: "Heath Ledger" },
  { question: "Which movie is about a simulated reality called the Matrix?", options: ["The Matrix", "Inception", "Tron", "Ready Player One"], answer: "The Matrix" },
  { question: "In which movie did Tom Hanks play a stranded man on an island?", options: ["Cast Away", "Sully", "Captain Phillips", "Saving Private Ryan"], answer: "Cast Away" },
  { question: "Which movie is about a boy wizard named Harry?", options: ["Harry Potter", "Percy Jackson", "The Hobbit", "Fantastic Beasts"], answer: "Harry Potter" }
];

let currentQuestion = 0;
let score = 0;
let timeLeft = 15;
let timer;

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const quizCard = document.getElementById('quizCard');
const resultCard = document.getElementById('resultCard');
const scoreEl = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');
const shareFacebookBtn = document.getElementById('shareFacebookBtn');
const downloadBtn = document.getElementById('downloadBtn');
const contactBtn = document.getElementById('contactBtn');
const timerEl = document.getElementById('timer');
const pixelBar = document.getElementById('pixelBar');
const progressBar = document.getElementById('progressBar');

function startTimer() {
  timeLeft = 15;
  timerEl.textContent = `Time Left: ${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Time Left: ${timeLeft}s`;
    if(timeLeft <= 0) {
      clearInterval(timer);
      showFeedback(false, true);
    }
  }, 1000);
}

function loadQuestion() {
  startTimer();
  const currentQuiz = quizData[currentQuestion];
  questionEl.textContent = currentQuiz.question;
  optionsEl.innerHTML = '';
  currentQuiz.options.forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.addEventListener('click', () => selectAnswer(option));
    optionsEl.appendChild(btn);
  });
}

function selectAnswer(option) {
  clearInterval(timer);
  const correct = option === quizData[currentQuestion].answer;
  if(correct) score++;
  showFeedback(correct);
}

function showFeedback(isCorrect, timedOut=false) {
  const buttons = optionsEl.querySelectorAll('button');
  const correctAnswer = quizData[currentQuestion].answer;
  const color = isCorrect ? getComputedStyle(document.documentElement).getPropertyValue('--correct') 
                          : getComputedStyle(document.documentElement).getPropertyValue('--wrong');
  pixelBar.querySelectorAll('div').forEach(d => d.style.background = color);

  buttons.forEach(btn => {
    if(btn.textContent === correctAnswer) btn.classList.add('correct');
    if(!isCorrect && btn.textContent !== correctAnswer) btn.classList.add('wrong');
    if(isCorrect && btn.textContent !== correctAnswer) btn.classList.remove('wrong');
  });

  progressBar.style.width = ((score / quizData.length) * 100) + "%";

  setTimeout(() => {
    pixelBar.querySelectorAll('div').forEach(d => d.style.background = getComputedStyle(document.documentElement).getPropertyValue('--accent'));
    buttons.forEach(btn => btn.classList.remove('correct','wrong'));
    nextQuestion();
  }, 1200);
}

function nextQuestion() {
  currentQuestion++;
  if(currentQuestion < quizData.length){
    loadQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  quizCard.style.display = 'none';
  resultCard.style.display = 'block';
  const message = getMotivation(score);
  scoreEl.innerHTML = `<div>You scored ${score} out of ${quizData.length}</div><div style="margin-top:8px; font-style:italic;">${message}</div>`;
}

function getMotivation(score) {
  const total = quizData.length;
  const percentage = (score / total) * 100;
  if(percentage === 100) return "🏆 Perfect score! You're a movie master!";
  if(percentage >= 80) return "🎉 Great job! You know your movies well!";
  if(percentage >= 50) return "👍 Not bad! Keep watching and learning!";
  if(percentage > 0) return "🙂 Good effort! Watch more movies and try again!";
  return "😅 Don't give up! Time to start your movie marathon!";
}

// Restart quiz
restartBtn.addEventListener('click', () => {
  currentQuestion = 0;
  score = 0;
  progressBar.style.width = "0%";
  quizCard.style.display = 'block';
  resultCard.style.display = 'none';
  loadQuestion();
});

// Facebook share
shareFacebookBtn.addEventListener('click', () => {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(`I scored ${score} out of ${quizData.length} in this Movie Quiz! Try it yourself!`);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
});

// Share as picture using html2canvas
downloadBtn.addEventListener('click', () => {
  html2canvas(resultCard).then(canvas => {
    const link = document.createElement('a');
    link.download = 'quiz_score.png';
    link.href = canvas.toDataURL();
    link.click();
  });
});

// Contact me
contactBtn.addEventListener('click', () => {
  window.location.href = "mailto:your-email@example.com";
});

loadQuestion();
