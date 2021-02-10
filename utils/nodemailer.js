const nodemailer = require("nodemailer");


const emailService = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'iloenyenwavictor@gmail.com',
      pass: 'passwordincorrect'
    }
  });


module.exports = emailService;
