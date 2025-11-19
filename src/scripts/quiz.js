// JavaScript Logic
let currentQuestionIndex = 0;
let numberQuestions;

function showQuestion(index) {

	const questions = 
		document.querySelectorAll('.flex.flex-col.mb-6');
    numberQuestions = questions.length;
    console.log(numberQuestions);
	questions.forEach((question, i) => {
		question.style.display = i === index ? 'flex' : 'none';
	});
}

function lastQuestion() {
    const nextQuestion = document.getElementById('nextquestion');
    nextQuestion.textContent="Submit !";
    nextQuestion.className = 'bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md'
    nextQuestion.onclick = submitQuiz
}

function resetNextQuestionButton() {
    const nextQuestionButton = document.getElementById('nextquestion');
    nextQuestionButton.textContent="Next";
    nextQuestionButton.className = "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md";
    nextQuestionButton.onclick = nextQuestion
}

function nextQuestion() {
	currentQuestionIndex = 
		
			Math.min(currentQuestionIndex + 1, numberQuestions - 1);
	showQuestion(currentQuestionIndex);
    if (currentQuestionIndex == numberQuestions - 1){
        lastQuestion();
    }
}

function prevQuestion() {
	currentQuestionIndex = 
		
			Math.max(currentQuestionIndex - 1, 0);
	showQuestion(currentQuestionIndex);
    resetNextQuestionButton();
}

function getSelectedOption(questionId) {
	const selectedOption = 
		
			document.querySelector(`input[name=${questionId}]:checked`);
	return selectedOption ? selectedOption.value : null;
}

function submitQuiz() {
	// Your quiz submission logic here

    document.getElementById('quizForm').classList.add('hidden');

	const answers = {
		q1: getSelectedOption('q1'),
		q2: getSelectedOption('q2'),
		// Add more questions as needed
	};

	// Calculate the score based on correct answers
	let score = 0;
	// Adjust correct answers based on your questions
	if (answers.q1 === 'b') {
		score += 10;
	}
	if (answers.q2 === 'c') {
		score += 10;
	}
	
	// Add more conditions for other questions

	// Display result section
	const resultSection = document.getElementById('result');
	resultSection.classList.remove('hidden');

	const scoreElement = document.getElementById('score');
	scoreElement.textContent = 
		`Score: ${score}/20`; // Assuming each question has 10 points

	const feedbackElement = 
		document.getElementById('feedback');
	// Customize feedback based on the score
	if (score === 20) {
		feedbackElement.textContent = 
			'Congratulations! You did great!';
	} else {
		feedbackElement.textContent = 
			'You can do better. Keep practicing.';
	}
}

// Initially hide the result section
document.getElementById('result').classList.add('hidden');

// Initially show the first question
showQuestion(currentQuestionIndex);

function restartQuiz() {
	// Reset question index
	currentQuestionIndex = 0;
	// Hide result section
	document.getElementById('result').classList.add('hidden');
    document.getElementById('quizForm').classList.remove('hidden');
    resetNextQuestionButton();


	// Clear selected options
	const radioButtons = 
		document.querySelectorAll('input[type="radio"]');
	radioButtons.forEach(button => button.checked = false);

	// Show the first question
	showQuestion(currentQuestionIndex);
}