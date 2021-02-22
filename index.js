const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors")
const app = express();

const PORT = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'Welcome to Hoxtygen portfolio API',
    })
  });

app.post("/api/form", (req, res) => {
  nodemailer.createTestAccount((err, account) => {
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
      port: 465,
      auth: {
        user: process.env.SERVICEACCESS,
        pass: process.env.SERVICEACCESSNETWORK,
      },
    });

    let mailOptions = {
      from: process.env.SERVICEACCESS,
      to: process.env.SERVICEACCESSNETWORKRECEIVER,
      replyTo: process.env.SERVICEACCESSNETWORKRECEIVER,
      subject: "New Message from Portfolio site",
      text: req.body.message,
      html: htmlEmail,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(400).json({
          status: 400,
          message: "Error Sending message",
        });
      }
     return res.status(200).json({
        status: 200,
        message: "Message sent successfully",
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
