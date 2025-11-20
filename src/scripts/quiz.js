class Quiz {
	constructor() {
		this.currentQuestionIndex = 0;
		this.numberQuestions = 0;

		// bind instance methods for use as event handlers
		this.showQuestion = this.showQuestion.bind(this);
		this.lastQuestion = this.lastQuestion.bind(this);
		this.resetNextQuestionButton = this.resetNextQuestionButton.bind(this);
		this.nextQuestion = this.nextQuestion.bind(this);
		this.prevQuestion = this.prevQuestion.bind(this);
		this.getSelectedOption = this.getSelectedOption.bind(this);
		this.submitQuiz = this.submitQuiz.bind(this);
		this.restartQuiz = this.restartQuiz.bind(this);

		this._init();
	}

	_init() {
		const questions = document.querySelectorAll(".flex.flex-col.mb-6");
		this.numberQuestions = questions.length;
		const resultEl = document.getElementById("result");
		if (resultEl) resultEl.classList.add("hidden");

		// ensure next button uses instance methods (if present in DOM)
		const nextBtn = document.getElementById("nextquestion");
		if (nextBtn) nextBtn.onclick = this.nextQuestion;

		const prevBtn = document.querySelector(
			'[onclick="sketch1.prevQuestion()"], button[onclick="prevQuestion()"], #prevquestion'
		);
		// don't assume prev selector; HTML may call quiz.prevQuestion() directly

		// show initial question
		this.showQuestion(this.currentQuestionIndex);
	}

	showQuestion(index) {
		const questions = document.querySelectorAll(".flex.flex-col.mb-6");
		this.numberQuestions = questions.length;
		questions.forEach((question, i) => {
			question.style.display = i === index ? "flex" : "none";
		});
	}

	lastQuestion() {
		const nextQuestion = document.getElementById("nextquestion");
		if (!nextQuestion) return;
		nextQuestion.textContent = "Submit !";
		nextQuestion.className =
			"bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md";
		nextQuestion.onclick = this.submitQuiz;
	}

	resetNextQuestionButton() {
		const nextQuestionButton = document.getElementById("nextquestion");
		if (!nextQuestionButton) return;
		nextQuestionButton.textContent = "Next";
		nextQuestionButton.className =
			"bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md";
		nextQuestionButton.onclick = this.nextQuestion;
	}

	nextQuestion() {
		this.currentQuestionIndex = Math.min(
			this.currentQuestionIndex + 1,
			this.numberQuestions - 1
		);
		this.showQuestion(this.currentQuestionIndex);
		if (this.currentQuestionIndex === this.numberQuestions - 1) {
			this.lastQuestion();
		}
	}

	prevQuestion() {
		this.currentQuestionIndex = Math.max(this.currentQuestionIndex - 1, 0);
		this.showQuestion(this.currentQuestionIndex);
		this.resetNextQuestionButton();
	}

	getSelectedOption(questionId) {
		// ensure the attribute value is quoted
		const selectedOption = document.querySelector(
			`input[name="${questionId}"]:checked`
		);
		return selectedOption ? selectedOption.value : null;
	}

	submitQuiz() {
		const quizForm = document.getElementById("quizForm");
		if (quizForm) quizForm.classList.add("hidden");

		const answers = {
			q1: this.getSelectedOption("q1"),
			q2: this.getSelectedOption("q2"),
			// extend as needed
		};

		let score = 0;
		if (answers.q1 === "b") score += 10;
		if (answers.q2 === "c") score += 10;

		const resultSection = document.getElementById("result");
		if (resultSection) resultSection.classList.remove("hidden");

		const scoreElement = document.getElementById("score");
		if (scoreElement) scoreElement.textContent = `Score: ${score}/20`;

		const feedbackElement = document.getElementById("feedback");
		if (feedbackElement) {
			if (score === 20)
				feedbackElement.textContent = "Congratulations! You did great!";
			else feedbackElement.textContent = "You can do better. Keep practicing.";
		}
	}

	restartQuiz() {
		this.currentQuestionIndex = 0;
		const resultSection = document.getElementById("result");
		if (resultSection) resultSection.classList.add("hidden");
		const quizForm = document.getElementById("quizForm");
		if (quizForm) quizForm.classList.remove("hidden");
		this.resetNextQuestionButton();

		const radioButtons = document.querySelectorAll('input[type="radio"]');
		radioButtons.forEach((button) => (button.checked = false));

		this.showQuestion(this.currentQuestionIndex);
	}
}

// create instance and expose as global for HTML access: quiz.nextQuestion(), quiz.restartQuiz(), etc.
const quiz = new Quiz();
window.quiz = quiz;

// Initially show the first question
quiz.showQuestion(quiz.currentQuestionIndex);
