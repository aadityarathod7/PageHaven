const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');

// @desc    Send contact form email
// @route   POST /api/contact
// @access  Public
const sendContactEmail = asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        res.status(400);
        throw new Error('Please fill in all fields');
    }

    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // your Gmail address
                pass: process.env.EMAIL_PASS  // your Gmail app password
            }
        });

        // Email content
        const mailOptions = {
            from: email,
            to: 'aadityarathod7@gmail.com',
            subject: `Contact Form: ${subject}`,
            html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        res.status(500);
        throw new Error('Error sending email. Please try again later.');
    }
});

module.exports = {
    sendContactEmail
}; 