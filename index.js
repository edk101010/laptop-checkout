const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

// Middleware to handle JSON requests
app.use(express.json());

// Serve the frontend HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Sample list of laptops
const laptops = [
  { id: 1, model: 'Dell XPS 13', status: 'available', checkedOutBy: null, checkedOutAt: null },
  { id: 2, model: 'MacBook Pro', status: 'available', checkedOutBy: null, checkedOutAt: null },
  { id: 3, model: 'HP Spectre', status: 'available', checkedOutBy: null, checkedOutAt: null },
];

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
  laptop.checkedOutAt = new Date().toLocaleString(); // Add the current date and time
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
  laptop.checkedOutAt = null; // Clear the timestamp
  res.send(`Laptop ${laptop.model} checked in`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
