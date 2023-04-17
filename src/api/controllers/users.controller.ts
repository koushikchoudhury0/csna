import { Router } from 'express';
import { usersModel } from '../models/users.model.js';
import { codes as HTTPCodes } from '../../constants/http.constants.js';
import { loginValidator, rotationValidator, signupValidator } from '../validators/users.validator.js';
import { router as adminUserController } from './admin/users.js';
import { passwordSanitizer } from '../sanitizers/users.sanitizer.js';
import { authorizeAdmin, authorizeUser, login } from '../helpers/auth.helper.js';
import { LoginData } from '../../types/login.interface.js';
import { handleGenericError, handleLoginError, handleSignUpError } from '../helpers/error.helper.js';
import { VERBOSITY } from '../../constants/error.constants.js';
import { rotateTokens } from '../../utils/auth.utils.js';
const { ERROR } = HTTPCodes;

export const router = Router();
router.use('/admin', authorizeUser, authorizeAdmin, adminUserController);

router.post(
    '/',
    signupValidator,
    passwordSanitizer,
    (req, res) => {
        usersModel
            .create(req.body)
            .then((user) => {
                const { password, ...rest } = user.toJSON();
                res.send(rest);
            }).catch((err) => {
                res.status(ERROR).send(
                    handleSignUpError(err, VERBOSITY.MSG_ONLY)
                );
            });
    }
);

router.post(
    '/login',
    loginValidator,
    passwordSanitizer,
    (req, res) => {
        login(
            req.body.email,
            req.body.password
        ).then((data: LoginData) => {
            res.send(data);
        }).catch((err) => {
            res.status(ERROR).send(
                handleLoginError(err)
            );
        });
    }
);

router.post(
    '/rotate',
    rotationValidator,
    (req, res) => {
        try {
            res.send(rotateTokens(req.body.refreshToken))
        } catch (err) {
            res.status(ERROR).send(
                handleGenericError(err)
            );
        }
    }
)
