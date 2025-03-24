const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use('/user/', express.static(path.join(__dirname, 'user.html')));
app.use('/doctor/history', express.static(path.join(__dirname, 'doc_history.html')));
app.use('/doctor/unattended', express.static(path.join(__dirname, 'doc_unattended.html')));
app.use('/doctor/chat-ai', express.static(path.join(__dirname, 'doc_chat.html')));
app.use('/js', express.static(path.join(__dirname, 'script')));
app.use('/css', express.static(path.join(__dirname, 'style')));

// Default route
app.get('/', (req, res) => {
    res.send(`home... sweeeet home... </br> <a href="http://localhost:${PORT}/user">user</a> </br> <a href="http://localhost:${PORT}/doctor/unattended">doctor</a>`);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
