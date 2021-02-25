const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Welcome to Hoxtygen portfolio API",
  });
});

app.post("/api/form", (req, res) => {
  const htmlEmail = `
  <h3>Contact Details</h3>
  <ul>
  <li>Name: ${req.body.name}</li>
  <li>Email: ${req.body.email}</li>
  </ul>
  <h3>Message</h3>
  <p>${req.body.message}</p>
  
        `;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SERVICEACCESS,
      pass: process.env.SERVICEACCESSNETWORK,
    },
  });

  let mailOptions = {
    from: req.body.email,
    to: process.env.SERVICEACCESS,
    cc: process.env.SERVICEACCESSNETWORKRECEIVER,
    bcc: process.env.SERVICEACCESSNETWORKRECEIVER,
    replyTo: process.env.SERVICEACCESS,
    subject: "New Message from Portfolio site",
    text: req.body.message,
    html: htmlEmail,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return res.status(400).json({
        status: 400,
        message: "Error Sending message",
        errorMessage: err,
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Message sent successfully",
      data,
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
