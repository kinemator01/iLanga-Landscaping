const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files from current directory

// NOTE: Replace 'your-email@gmail.com' and 'your-app-password' with valid Gmail credentials or use environment variables for security

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-app-password'
    }
  });

  const mailOptions = {
    from: email,
    to: 'your-email@gmail.com',
    subject: `Contact Form - ${name}`,
    text: message
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending mail:', error);
    res.status(500).send('Failed to send email');
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

app.post('/booking', async (req, res) => {
  const { name, email, phone, date, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-app-password'
    }
  });

  const mailOptions = {
    from: email,
    to: 'your-email@gmail.com',
    subject: `Booking Request - ${name}`,
    text: `Phone: ${phone}\nDate: ${date}\nMessage: ${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Booking email sent successfully');
  } catch (error) {
    console.error('Error sending booking mail:', error);
    res.status(500).send('Failed to send booking email');
  }
});
console.log("h");