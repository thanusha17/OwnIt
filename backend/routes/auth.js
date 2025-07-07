import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { sendOtpToEmail, verifyOtpAndRegister } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/send-otp', sendOtpToEmail);
router.post('/verify-otp', verifyOtpAndRegister);


export default router;
