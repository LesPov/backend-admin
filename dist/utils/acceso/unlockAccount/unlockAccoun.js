"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlockAccount = void 0;
const verificationsModel_1 = __importDefault(require("../../../models/verificaciones/verificationsModel"));
const lockAccount_1 = require("../lockAccount/lockAccount");
/**
 * Desbloquear la cuenta de un usuario en base a su nombre de usuario.
 * @async
 * @param {string} usuario - El nombre de usuario del usuario cuya cuenta se desbloqueará.
 * @returns {Promise<void>} No devuelve ningún valor explícito, pero desbloquea la cuenta del usuario si es encontrado en la base de datos.
 */
const unlockAccount = (usuario) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield findUserAndLoadVerificationInfo(usuario);
        if (user) {
            yield resetFailedLoginAttempts(user);
        }
    }
    catch (error) {
        handleUnlockAccountError(error);
    }
});
exports.unlockAccount = unlockAccount;
const findUserAndLoadVerificationInfo = (usuario) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, lockAccount_1.findUserByUserName)(usuario);
    return user || null;
});
const resetFailedLoginAttempts = (user) => __awaiter(void 0, void 0, void 0, function* () {
    yield verificationsModel_1.default.update({ intentos_ingreso: 0 }, { where: { usuario_id: user.usuario_id } });
});
const handleUnlockAccountError = (error) => {
    console.error('Error al desbloquear la cuenta:', error);
};