// getting the quiz Data using API method from json.
async function getData() {
  const baseUrl = '../assets/quiz.json';
  const response = await fetch(baseUrl);
  const responseData = await response.json();
  return responseData;
}

// Accessing the DOM Element.
let quesNum = document.querySelector('.question-number');
let quesText = document.querySelector('.question-text');
let optContainer = document.querySelector('.option-container');
let ansIndicator = document.querySelector('.ans-indicator');
let quizContainer = document.querySelector('.quiz-container');
let homeContainer = document.querySelector('.home-container');
let customContainer = document.querySelector('.custom-container');
let resultContainer = document.querySelector('.result-container');
let quesCount = 0;
let currentQues;
let availQues = [];
let availOptions = [];
let correctAns = 0;
let attempt = 0;

// pushing the questions in availQues Array
function setAvailQues() {
  getData().then(res => {
    let quizData = res;
    const totalQues = quizData.questions;
    for (let i = 0; i < totalQues.length; i++) {
      availQues.push(totalQues[i]);
    }
  })
}

// setting question number, questions, and options.
function getNewQuestion() {
  getData().then(res => {
    let quizData = res;
    const totalQues = quizData.questions;
    // setting the question number.
    quesNum.innerHTML = `Questions ${quesCount + 1} of ${totalQues.length}`;
    // setting the random question.
    let quesIndex = availQues[Math.floor(Math.random() * availQues.length)];
    currentQues = quesIndex;
    quesText.innerHTML = currentQues.question;
    // get the index of 'questionIndex' from the availQues array.
    let index1 = availQues.indexOf(quesIndex);
    // Removing the index of 'questionIndex' from the availQues array. to avaoid repetition.
    availQues.splice(index1, 1);

    // set options
    // get the length of options in current question.
    const optionLen = currentQues.answers.length;
    // pushing options in to available array.
    for (let i = 0; i < optionLen; i++) {
      availOptions.push(i)
    }
    optContainer.innerHTML = '';
    let animationDelay = 0.15;
    //  create options in innerHTML
    for (let i = 0; i < optionLen; i++) {
      let optionIndex = availOptions[Math.floor(Math.random() * availOptions.length)];
      // get the position of 'optionIndex' from the availableoptions
      const index2 = availOptions.indexOf(optionIndex);
      // removing the position of 'optionIndex' from the availableoptions, so option doesn' repeat.
      availOptions.splice(index2, 1);
      let option = document.createElement("div");
      option.innerHTML = currentQues.answers[i];
      option.id = i;
      option.className = 'option';
      option.style.animationDelay = animationDelay + 's';
      animationDelay = animationDelay + 0.15;
      optContainer.appendChild(option);
      option.setAttribute("onclick", "getResult(this)");
    }
    quesCount++;
  })
}

// get the result of current attempt question,
function getResult(ele) {
  const id = parseInt(ele.id);
  let setId = id + 1;
  // get the answer by comparing the id of clicked option.
  if (setId === currentQues.correct_answer) {
    // set the green color to correc option.
    ele.classList.add("correct");
    // add indicator to correct mark
    updateAnswerIndicator("correct");
    correctAns++;
    console.log("correct", correctAns);
  }
  else {
    ele.classList.add("wrong");
    // add indicator to wrong mark
    updateAnswerIndicator("wrong");
    // if the answer is incorrect then show the correct option by adding green color the correct option.
  }
  attempt++;
  unclickableOption();
}
// make all the option unclickable. once the user select the option(restricting user to change the option.)
function unclickableOption() {
  const optionLen = optContainer.children.length;
  for (let i = 0; i < optionLen; i++) {
    optContainer.children[i].classList.add("already-answered");
  }
}

function next() {
  getData().then(res => {
    let quizData = res;
    const totalQues = quizData.questions;
    if (quesCount === totalQues.length) {
      console.log("quiz Over");
      quizOver();
    }
    else {
      getNewQuestion();
    }
  })
}

function answerIndicator() {
  ansIndicator.innerHTML = '';
  getData().then(res => {
    let quizData = res;
    const totalQues = quizData.questions;
    console.log(totalQues.length);
    for (let i = 0; i < totalQues.length; i++) {
      let ansIndicatorChild = document.createElement('div');
      ansIndicatorChild.setAttribute('class', 'ans-indicator-child')
      ansIndicator.appendChild(ansIndicatorChild);
    }
  })
}

function updateAnswerIndicator(marktype) {
  ansIndicator.children[quesCount - 1].classList.add(marktype);
}

function quizOver() {
  // hide quiz container
  quizContainer.classList.add("hide");
  //  show result container
  resultContainer.classList.remove("hide");
  quizResult();
}

// get the quiz result. 
function quizResult() {
  getData().then(res => {
    let quizData = res;
    const totalQues = quizData.questions;
    resultContainer.querySelector(".total-question").innerHTML = `${totalQues.length}`;
    resultContainer.querySelector(".total-attempt").innerHTML = attempt;
    resultContainer.querySelector(".total-correct").innerHTML = correctAns;
    let wrongAns = attempt - correctAns;
    resultContainer.querySelector(".total-wrong").innerHTML = wrongAns;
    let percentage = (correctAns / totalQues.length) * 100;
    resultContainer.querySelector(".percentage").innerHTML = percentage.toFixed(2) + "%";
    resultContainer.querySelector(".total-score").innerHTML = `${(correctAns * 4) + (wrongAns * -1)}`;
  })
}
function resetQuiz() {
  quesCount = 0;
  correctAns = 0;
  attempt = 0;
}

function tryAgainQuiz() {
  resultContainer.classList.add("hide");
  // show the quiz container..
  quizContainer.classList.remove("hide");
  resetQuiz();
  startQuiz();
}

function goToHome() {
  // hide result box
  resultContainer.classList.add("hide");
  // show home container..
  homeContainer.classList.remove("hide");
  resetQuiz();
}

// Start quiz ...
function startQuiz() {
    // hide home container..
    homeContainer.classList.add("hide");
    // show home container.
    quizContainer.classList.remove('hide');
  // first set all questions in avail Array.
  setAvailQues();
  // calling the questions then,
  getNewQuestion();
  // to create the answer indicator.
  answerIndicator();
}

window.onload = function() {
  getData().then(res => {
    let quizData = res;
    const totalQues = quizData.questions;
    homeContainer.querySelector('.total-question').innerHTML = `${totalQues.length}`;
  })
}