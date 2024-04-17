import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: "sriharidinesh.20bcd7236@vitap.ac.in",
    pass: "ddky gfiq gtlq lxwi",
  },
});

const Email = async (recipientEmail, subject, htmlfield) => {
  try {
    const mailOptions = {
      from: {
        name: "Tericsoft",
        address: "sriharidinesh.20bcd7236@vitap.ac.in",
      },
      to: recipientEmail,
      subject: subject,
      text: "Hello world?",
      html: htmlfield,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    res.status(500).json({ error: "Error sending login email notification",status:500, message: error.message });
  }
};

export { Email }
