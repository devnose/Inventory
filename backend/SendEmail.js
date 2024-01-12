var nodemailer = require('nodemailer');

const pass = 'xwchfqhfwxghxskm'

const sendEmail = async ({
  fromid,
  selectedEmails,
  subject,
  body,
  attachment
}) => {
  try {
    console.log(fromid)
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      },
      auth: {
        user: fromid,
        pass: pass,
      }
    });

    const mailOptions = {
      from: fromid,
      to: 'aaront@kleertech.com',  // Convert array of emails to comma-separated string
      subject,
      text: body,
      attachments: [
        {
          filename: attachment.name + '.pdf',
          content: Buffer.from(attachment.attachData),  // Assuming 'attachment.data' is a Buffer
          contentType: 'application/pdf'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return { status: 'success', message: 'Email sent: ' + info.response }; 

    
  } catch (error) {
    console.log('An error occurred: ', error);
    return { status: 'error', message: error.message };  // return an object indicating fail  }
}
}

module.exports = sendEmail;
