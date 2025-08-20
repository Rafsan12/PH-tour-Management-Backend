import express from "express";
import { OTPController } from "./otp.controller";
const router = express.Router();

router.post("/sent", OTPController.sentOpt);
router.post("/verify", OTPController.verifyOtp);
export const otpRoutes = router;
