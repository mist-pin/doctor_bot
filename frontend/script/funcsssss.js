// Submit User Data
async function submitUserData() {
    const name = document.getElementById('name').value;
    const dob = document.getElementById('dob').value;
    const visitDate = document.getElementById('visitDate').value;
    const symptoms = document.getElementById('symptoms').value;

    const response = await fetch('http://127.0.0.1:5000/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, dob, visitDate, symptoms })
    });
    const data = await response.json();
    alert(data.message);
}

// Load Doctor History
async function loadDoctorHistory() {
    const response = await fetch('http://127.0.0.1:5000/api/doc/history');
    const history = await response.json();
    const historyCards = document.getElementById('historyCards');
    historyCards.innerHTML = '';

    history.forEach(patient => {
        const card = document.createElement('div');
        card.innerHTML = `<h3>${patient.name}</h3><p>Visit Count: ${patient.visit_count}</p>`;
        historyCards.appendChild(card);
    });
}

// Load Unattended Questions
async function loadUnattendedQuestions() {
    const response = await fetch('http://127.0.0.1:5000/api/doc');
    const questions = await response.json();
    const questionsList = document.getElementById('unattendedQuestions');
    questionsList.innerHTML = '';

    questions.forEach(question => {
        const card = document.createElement('div');
        card.style.cursor = 'pointer';
        card.onclick = () => goToChatAI(question.question);
        card.innerHTML = `<h3>${question.name}</h3><p>Question: ${question.question}</p>`;
        questionsList.appendChild(card);
    });
}

// Redirect to chat page with the question in query params
function goToChatAI(question) {
    window.location.href = `/doctor/chat-ai?question=${encodeURIComponent(question)}`;
}

// Doctor AI Chat
async function askAI() {
    const question = document.getElementById('question').value;
    const response = await fetch('http://127.0.0.1:5000/api/doc/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
    });
    const data = await response.json();
    const chatWindow = document.getElementById('chatWindow');
    const message = document.createElement('div');
    message.innerHTML = `<p><strong>Q:</strong> ${question}</p><p><strong>A:</strong> ${data.answer}</p>`;
    chatWindow.appendChild(message);
}
