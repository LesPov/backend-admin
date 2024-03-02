"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sendCodeVerification_1 = require("../../../controllers/auth/telefono/userVerification/sendCodeVerification/sendCodeVerification");
const phoneVerificationRouter = (0, express_1.Router)();
/**
 * POST /api/user/verify/send
 * Ruta para enviar el código de verificación por SMS.
 * Público
 */
phoneVerificationRouter.post("/verify/send", sendCodeVerification_1.sendCodeVerification);
// /**
//  * POST /api/user/verify/resend 
//  * Ruta para reenviar el código de verificación por SMS.
//  * Público
//  */
// phoneVerificationRouter.post("/verify/resend", resendVerificationCodeSMS);
// /**
//  * PUT /api/user/verify/phone
//  * Ruta para verificar el número de teléfono.
//  * Público
//  */
// phoneVerificationRouter .put('/verify/phone', verifyPhoneNumber);
exports.default = phoneVerificationRouter;
