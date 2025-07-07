import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"OwnIt Support" <${process.env.EMAIL}>`,
    to: email,
    subject: 'Your OTP for OwnIt Registration',
    html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
  });
};
