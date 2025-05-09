// Import required modules
const express = require('express'); // Express framework for server
const nodemailer = require('nodemailer'); // Nodemailer for sending emails
const cors = require('cors'); // CORS middleware to allow cross-origin requests
const bodyParser = require('body-parser'); // Middleware to parse JSON request bodies
const path = require('path'); // Path module for handling file paths
const sqlite3 = require('sqlite3').verbose(); // SQLite3 for database
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

// Parse incoming JSON requests
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS) from the current directory
app.use(express.static(__dirname));

// Set up SQLite database connection
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create tables if they don't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    date TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Create a reusable transporter object using Gmail SMTP with environment variables
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

// Endpoint to handle contact form submissions
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Insert contact data into database
  const insertContact = `INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)`;
  db.run(insertContact, [name, email, message], function(err) {
    if (err) {
      console.error('Error inserting contact:', err.message);
      res.status(500).send('Failed to save contact data');
      return;
    }
  });

  const transporter = createTransporter();

  // Email options for the contact form message
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address (your email)
    to: process.env.EMAIL_USER, // Receiver address (your email)
    replyTo: email, // Reply to user's email
    subject: `Contact Form - ${name}`, // Email subject with sender's name
    text: message // Email body text
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    // Log error and send failure response
    console.error('Error sending mail:', error);
    res.status(500).send('Please try again later!');
  }
});

// Endpoint to handle booking form submissions
app.post('/booking', async (req, res) => {
  const { name, email, phone, date, message } = req.body;

  // Insert booking data into database
  const insertBooking = `INSERT INTO bookings (name, email, phone, date, message) VALUES (?, ?, ?, ?, ?)`;
  db.run(insertBooking, [name, email, phone, date, message], function(err) {
    if (err) {
      console.error('Error inserting booking:', err.message);
      res.status(500).send('Failed to save booking data');
      return;
    }
  });

  const transporter = createTransporter();

  // Email options for the booking request
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address (your email)
    to: process.env.EMAIL_USER, // Receiver address (your email)
    replyTo: email, // Reply to user's email
    subject: `Booking Request - ${name}`, // Email subject with sender's name
    text: `Phone: ${phone}\nDate: ${date}\nMessage: ${message}` // Email body text with booking details
  };

  try {
    // Send the booking email
    await transporter.sendMail(mailOptions);
    res.status(200).send('Booking email sent successfully');
  } catch (error) {
    // Log error and send failure response
    console.error('Error sending booking mail:', error);
    res.status(500).send('Failed to send booking email');
  }
});

// Start the server and listen on the specified port
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

console.log("h");

