"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorMesages_1 = require("../errorMesages");
const validateRole = (requiredRole, req, res, next) => {
    var _a;
    // Verifica el token del usuario para obtener el rol
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            msg: errorMesages_1.errorMessages.tokenNotProvided,
        });
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || 'pepito123');
        const userRole = decodedToken.rol;
        // Verificar si el rol del usuario coincide con el rol requerido o es un administrador
        if (userRole === requiredRole || userRole === 'admin') {
            // Si el rol es válido, se permite el acceso a la ruta protegida
            next();
        }
        else {
            return res.status(403).json({
                msg: errorMesages_1.errorMessages.accessDenied,
            });
        }
    }
    catch (error) {
        return res.status(401).json({
            msg: errorMesages_1.errorMessages.invalidToken,
        });
    }
};
exports.default = validateRole;
