import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import { successMessages } from '../../../middleware/successMessages';

import { validateInput, handleInputValidationErrors, validatePassword, handlePasswordValidationErrors, validateEmail } from '../../../utils/validation/validationUtils';
import { handleExistingUserError, checkExistingUser } from '../../../utils/existingUser/existingUserUtils';
import { handleServerError, createNewUserWithRole , initializeUserProfile, generateAndSaveVerificationCode } from '../../../utils/database/databaseUtils';
import { getRoleMessage } from '../../../utils/role/roleUtils';
import { sendVerificationEmail } from '../../../utils/emailsend/emailUtils';


/**
 * Controlador para registrar un nuevo usuario.
 * @param req La solicitud HTTP entrante.
 * @param res La respuesta HTTP saliente.
 */
export const newUser = async (req: Request, res: Response) => {
    try {
        const { usuario, contrasena, email, rol } = req.body;

        // Validar la entrada de datos
        const inputValidationErrors = validateInput(usuario, contrasena, email, rol);
        handleInputValidationErrors(inputValidationErrors, res);

        // Validar los requisitos de la contraseña
        const passwordValidationErrors = validatePassword(contrasena);
        handlePasswordValidationErrors(passwordValidationErrors, res);

        // Validar el formato del correo electrónico
        validateEmail(email);


        // Verificar si el usuario o el correo electrónico ya existen
        const existingUserError = await checkExistingUser(usuario, email);
        handleExistingUserError(existingUserError, res);
        // Hash de la contraseña antes de guardarla en la base de datos
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        // Crear un nuevo usuario en la base de datos
        const newUser = await createNewUserWithRole (usuario, hashedPassword, email, rol);
        // Inicializar el perfil de usuario si es necesario
        await initializeUserProfile(newUser.usuario_id);

        // Generar y guardar un código de verificación
        const verificationCode = await generateAndSaveVerificationCode(newUser.usuario_id, email);

        // Enviar un correo electrónico de verificación
        await sendVerificationEmail(email, usuario, verificationCode);

        // Obtener el mensaje de éxito según el rol del usuario
        const userMessage = getRoleMessage(rol);

        // Responder con un mensaje de éxito
        res.json({
            msg: successMessages.userRegistered(usuario, userMessage),
        });
    } catch (error) {
        // Manejar errores internos del servidor
        handleServerError(error, res);
    }
};





