import { RequestHandler } from "express";
import { codes, errors } from "../../constants/http.constants.js";
import { CustomError } from "../../types/custom-error.class.js";
import { LoginData } from "../../types/login.interface.js";
import { getTokens, verifyAccessTokens } from "../../utils/auth.utils.js";
import { usersModel } from "../models/users.model.js";
import { USER_SUBJECT } from "../../constants/auth.constants.js";

const authorizeUser: RequestHandler = (req, res, next) => {
    console.log("USER AUTH");
    try {
        const accessToken = String(req.headers['authorization']);
        const access = verifyAccessTokens(accessToken);
        req.headers['access'] = JSON.stringify(access);
        next();
    } catch (err) {
        console.error(err);
        res.sendStatus(codes.UNAUTHORIZED);
    }
}

const authorizeAdmin: RequestHandler = (req, res, next) => {
    console.log("ADMIN AUTH");
    try {
        const access = JSON.parse(String(req.headers['access']));
        if (access.sub === USER_SUBJECT.ADMIN) {
            next()
        } else {
            throw new CustomError(
                `[BLOCKED] User: ${access.id} Reason: NO_ADMIN Type: ${access.subject} Path: ${req.url}`
            );
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(codes.UNAUTHORIZED);
    }
}

const login = async (
    email: string,
    password: string
) => {
    const user = await usersModel.findOne({
        email,
        password
    });
    if (!user) {
        throw new CustomError(errors.NO_SUCH_USER);
    }
    const { refreshToken, accessToken } = getTokens(
        user._id,
        user.firstName,
        user.admin
    );
    const loginData: LoginData = {
        accessToken,
        refreshToken,
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    }
    return loginData;
}

export { login, authorizeUser, authorizeAdmin };