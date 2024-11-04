let currentQuestion = 1;
const totalQuestions = 5;

function nextQuestion() {
    // Hide the current question
    document.getElementById(`question${currentQuestion}`).classList.remove("active");

    // Increment the question counter
    currentQuestion++;

    if (currentQuestion <= totalQuestions) {
        // Show the next question
        document.getElementById(`question${currentQuestion}`).classList.add("active");

        // If we're at the last question, show the Submit button instead of Next
        if (currentQuestion === totalQuestions) {
            document.getElementById("nextButton").style.display = "none";
            document.getElementById("submitButton").style.display = "inline-block";
        }
    }
}