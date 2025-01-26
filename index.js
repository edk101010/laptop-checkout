const express = require('express'); // Use the Express library
const app = express(); // Start the app
const port = 3000; // Choose a port to run on

// A route that says hello
app.get('/', (req, res) => {
  res.send('Hi, babydoll hacker! 💻✨ Your server is working!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
