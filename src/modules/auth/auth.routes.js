import {Router} from "express";
import validate from "../../common/middleware/validate.middleware.js"
import RegisterDto from "./dto/register.dto.js"
import * as Controller from "./auth.controller.js"
import ResetPasswordDto from "./dto/reset-password.dto.js";
import forgotpasswordDto from "./dto/forgot-password.dto.js";
import LoginDto from "./dto/login.dto.js";
import { authenticate } from "./auth.middleware.js";


const router = Router();

router.post("/register",validate(RegisterDto),Controller.register);
router.post("/login", validate(LoginDto),Controller.login);
router.post("/refresh-token",Controller.refreshToken);
router.post("/logout",authenticate,Controller.logout);
router.get("/verify-email/:token",Controller.verifyEmail);
router.post(
  "/forgot-password",
  validate(forgotpasswordDto),
  Controller.forgotPassword,
);
router.put(
  "/reset-password/:token",
  validate(ResetPasswordDto),
  Controller.resetPassword,
);
router.get("/me", authenticate, Controller.getMe);

export default router;