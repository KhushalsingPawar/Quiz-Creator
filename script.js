let questionCounter = 0;

function addQuestion() {
  const type = document.getElementById("questionType").value;
  const container = document.getElementById("questionsContainer");
  const qId = `q${questionCounter++}`;

  let html = `
    <div class="question-block" id="${qId}">
      <div class="mb-3">
        <label class="form-label">Question</label>
        <input type="text" name="${qId}-text" class="form-control" placeholder="Enter question" required>
      </div>
      <input type="hidden" name="${qId}-type" value="${type}">`;

  if (type === "mcq") {
    ['A', 'B', 'C', 'D'].forEach(opt => {
      html += `
        <div class="mb-2">
          <input type="text" name="${qId}-opt${opt}" class="form-control" placeholder="Option ${opt}" required>
        </div>`;
    });
    html += `
      <div class="mb-2">
        <label>Correct Option</label>
        <select name="${qId}-correct" class="form-select" required>
          <option value="A">A</option><option value="B">B</option>
          <option value="C">C</option><option value="D">D</option>
        </select>
      </div>`;
  } else if (type === "truefalse") {
    html += `
      <div class="mb-2">
        <label>Correct Answer</label>
        <select name="${qId}-correct" class="form-select" required>
          <option value="True">True</option>
          <option value="False">False</option>
        </select>
      </div>`;
  } else if (type === "shortanswer") {
    html += `
      <div class="mb-2">
        <label>Correct Answer</label>
        <input type="text" name="${qId}-correct" class="form-control" required>
      </div>`;
  }

  html += `</div>`;
  container.insertAdjacentHTML("beforeend", html);
}

function generateQuiz() {
  const title = document.getElementById("quizTitle").value.trim();
  const form = document.getElementById("questionsForm");
  const formData = new FormData(form);

  if (!title) {
    alert("Please enter quiz title.");
    return;
  }

  const quiz = { title, questions: [] };

  for (let [name, value] of formData.entries()) {
    const [qid, key] = name.split("-");
    let question = quiz.questions.find(q => q.id === qid);
    if (!question) {
      question = { id: qid };
      quiz.questions.push(question);
    }
    question[key] = value;
  }

  // Open quiz in new tab
  const win = window.open("", "_blank");
  win.document.write(generateQuizHTML(quiz));
  win.document.close();
}

function generateQuizHTML(quiz) {
  let html = `
  <html><head><title>${quiz.title}</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  </head><body class="bg-light">
  <div class="container py-5">
    <h2 class="text-center mb-4 text-primary">${quiz.title}</h2>
    <form id="quizForm">`;

  quiz.questions.forEach((q, i) => {
    html += `<div class="card p-3 mb-3">
      <h5>Q${i + 1}: ${q.text}</h5>`;

    if (q.type === "mcq") {
      ['A', 'B', 'C', 'D'].forEach(opt => {
        html += `
        <div class="form-check">
          <input class="form-check-input" type="radio" name="${q.id}" value="${opt}">
          <label class="form-check-label">${q["opt" + opt]}</label>
        </div>`;
      });
    } else if (q.type === "truefalse") {
      html += `
        <div class="form-check">
          <input class="form-check-input" type="radio" name="${q.id}" value="True">
          <label class="form-check-label">True</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="${q.id}" value="False">
          <label class="form-check-label">False</label>
        </div>`;
    } else if (q.type === "shortanswer") {
      html += `<input type="text" name="${q.id}" class="form-control mt-2" placeholder="Type your answer">`;
    }

    html += `</div>`;
  });

  html += `
    <div class="text-center mt-4">
      <button class="btn btn-success btn-lg">Submit Quiz</button>
      <div id="result" class="mt-4 fw-bold"></div>
    </div>
    </form>
    <script>
      const answers = ${JSON.stringify(quiz.questions.map(q => ({ id: q.id, correct: q.correct.trim() })))};
      document.getElementById("quizForm").addEventListener("submit", function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        let score = 0;
        answers.forEach(q => {
          const ans = (formData.get(q.id) || "").trim().toLowerCase();
          const correct = q.correct.trim().toLowerCase();
          if (ans === correct) score++;
        });
        document.getElementById("result").innerText = "Your Score: " + score + " / " + answers.length;
      });
    </script>
  </div></body></html>`;

  return html;
}
