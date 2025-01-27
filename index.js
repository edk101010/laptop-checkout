const express = require('express');
const fs = require('fs'); // For working with files
const path = require('path');
const app = express();
const port = 3000;

// Middleware to handle JSON requests
app.use(express.json());

// Serve the frontend HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Sample list of laptops
const laptops = [
  { id: 1, model: 'Dayton Laptop 1', status: 'available', checkedOutBy: null, checkedOutAt: null },
  { id: 2, model: 'Dayton Laptop 2', status: 'available', checkedOutBy: null, checkedOutAt: null },
  { id: 3, model: 'Dayton Laptop 3', status: 'available', checkedOutBy: null, checkedOutAt: null },
  { id: 4, model: 'King-Lincoln MacBook Pro 1', status: 'available', checkedOutBy: null, checkedOutAt: null },
  { id: 5, model: 'King-Lincoln MacBook Pro 2', status: 'available', checkedOutBy: null, checkedOutAt: null },
  { id: 6, model: 'King-Lincoln MacBook Pro 3', status: 'available', checkedOutBy: null, checkedOutAt: null },
  { id: 7, model: 'King-Lincoln iPad 1', status: 'available', checkedOutBy: null, checkedOutAt: null },
  { id: 8, model: 'King-Lincoln iPad 2', status: 'available', checkedOutBy: null, checkedOutAt: null },
  { id: 2, model: 'King-Lincoln iPad 3gi', status: 'available', checkedOutBy: null, checkedOutAt: null },
];

// Function to get the current EST timestamp
function getESTTimestamp() {
  const now = new Date();
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(now);
}

// Function to log actions to a file
function logAction(action, laptop, user = null) {
  const timestamp = getESTTimestamp();
  const logEntry = `[${timestamp}] ${action} - Laptop: ${laptop.model}, User: ${user || 'N/A'}\n`;

  // Append the log entry to the file
  fs.appendFileSync('logs.txt', logEntry, 'utf8');
}

// Route to list all laptops
app.get('/laptops', (req, res) => {
  res.json(laptops);
});

// Route to check out a laptop
app.post('/checkout', (req, res) => {
  const { id, user } = req.body;
  const laptop = laptops.find((l) => l.id === id);

  if (!laptop) {
    return res.status(404).send('Laptop not found');
  }
  if (laptop.status === 'checked out') {
    return res.status(400).send('Laptop is already checked out');
  }

  laptop.status = 'checked out';
  laptop.checkedOutBy = user;
  laptop.checkedOutAt = getESTTimestamp(); // Use the EST timestamp

  logAction('Checked Out', laptop, user);
  res.send(`Laptop ${laptop.model} checked out by ${user}`);
});

// Route to check in a laptop
app.post('/checkin', (req, res) => {
  const { id } = req.body;
  const laptop = laptops.find((l) => l.id === id);

  if (!laptop) {
    return res.status(404).send('Laptop not found');
  }
  if (laptop.status === 'available') {
    return res.status(400).send('Laptop is already available');
  }

  laptop.status = 'available';
  laptop.checkedOutBy = null;
  laptop.checkedOutAt = null;

  logAction('Checked In', laptop);
  res.send(`Laptop ${laptop.model} checked in`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
