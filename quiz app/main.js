// select elements
let countSpan = document.querySelector(".count span");
let bulletsContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answer-area");
let submitButton = document.querySelector(".submit");
let results = document.querySelector(".results");
let countdownTimer = document.querySelector(".countdown");
let countdownFunc;
// options
let current = 0;
let score = 0;
let questionNum;
function questionsRequest() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questions = JSON.parse(this.responseText);

      createBullets(questions.length, current);
      questionNum = questions.length;
      generateQuestion(questions[current], questionNum);

      countdown(5, questionNum);
      submitButton.onclick = () => {
        let rightAnswer = questions[current].correct;
        checkAnswer(rightAnswer, questionNum);
        current++;
        if (current < questions.length) {
          clearInterval(countdownFunc);
          countdown(5, questionNum);

          answerArea.innerHTML = "";
          quizArea.innerHTML = "";
          bulletsContainer.innerHTML = "";
          generateQuestion(questions[current], questionNum);
          createBullets(questions.length, current);
        } else {
          let gradeSpan = document.createElement("span");
          if (score < questionNum / 2) {
            gradeSpan.innerHTML = `<span class="bad"> Bad</span> you answered ${score} out of ${questionNum} `;
            results.appendChild(gradeSpan);
          } else if (score > questionNum / 2 && score < questionNum) {
            gradeSpan.innerHTML = `<span class="good"> good</span> you answered ${score} out of ${questionNum} `;
            results.appendChild(gradeSpan);
          } else if (score == questionNum) {
            gradeSpan.innerHTML = `<span class="perfect"> perfect</span> you answered ${score} out of ${questionNum}`;
            results.appendChild(gradeSpan);
          }
          results.style.padding = "20px";
          results.style.textAlign = "center";
          results.style.fontSize = "15px";
          answerArea.remove();
          quizArea.remove();
          bulletsContainer.remove();
          submitButton.remove();
          clearInterval(countdownFunc);
          countdownTimer.remove();
          submitButton.style.pointerEvents = "none";
        }
      };
    }
  };

  myRequest.open("GET", "questions.json", true);
  myRequest.send();
}
questionsRequest();
function createBullets(num) {
  // get the number of questions
  countSpan.innerHTML = num;
  // bullets equal to the number of questions
  for (let i = 0; i < num; i++) {
    let bulletSpan = document.createElement("span");
    if (i <= current) {
      bulletSpan.classList.add("on");
    }
    bulletsContainer.appendChild(bulletSpan);
  }
}
function generateQuestion(obj, qNum) {
  let questionTitle = document.createElement("h2");
  // create the question text
  let questionText = document.createTextNode(obj.text);

  questionTitle.appendChild(questionText);
  quizArea.appendChild(questionTitle);

  for (let i = 1; i <= 4; i++) {
    let answerDiv = document.createElement("div");
    answerDiv.classList.add("answer");
    // create the radio input
    let radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.name = "answer";
    radioInput.id = `answer_${i}`;
    if (i == 1) {
      radioInput.setAttribute("checked", true);
    }
    radioInput.dataset.answer = obj[`answer${i}`];
    let answerLabel = document.createElement("label");
    answerLabel.innerHTML = obj[`answer${i}`];
    answerLabel.htmlFor = `answer_${i}`;
    answerDiv.appendChild(radioInput);
    answerDiv.appendChild(answerLabel);
    answerArea.appendChild(answerDiv);
  }
}

function checkAnswer(rAnswer, qNum) {
  let theAnswers = document.getElementsByName("answer");
  let choosenAnswer;

  for (let i = 0; i < theAnswers.length; i++) {
    if (theAnswers[i].checked) {
      choosenAnswer = theAnswers[i].dataset.answer;
    }
  }
  if (choosenAnswer === rAnswer) {
    score++;
    console.log("good answer");
    console.log(score);
  }
  console.log("the choosen answer is " + choosenAnswer);
  console.log("the write answer is " + rAnswer);
}
function countdown(duration, qCount) {
  if (current <= qCount) {
    countdownFunc = setInterval(() => {
      let minutes = parseInt(duration / 60);
      let seconds = parseInt(duration % 60);

      let finalMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      let finalSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

      countdownTimer.innerHTML = `<span class="minutes">${finalMinutes}</span>: <span class="seconds">${finalSeconds}</span>`;
      if (--duration < 0) {
        clearInterval(countdownFunc);
        console.log("finished");
        submitButton.click();
      }
    }, 1000);
  }
}
