import { RequestHandler } from 'express';
import Joi from 'joi';
import { codes, errors } from '../../constants/http.constants.js';

export const signupValidator: RequestHandler = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string()
            .min(1)
            .max(60)
            .regex(/^[a-z ,.'-]+$/i)
            .required(),
        lastName: Joi.string()
            .min(1)
            .max(60)
            .regex(/^[a-z ,.'-]+$/i)
            .required(),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required(),
        password: Joi.string()
            .min(8)
            .max(30)
            .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
            .required(),
        admin: Joi.boolean()
            .default(false)
    });
    const validation = schema.validate(req.body);
    if (validation.error) {
        console.error(validation.error);
        res.status(codes.BAD_REQUEST).send(errors.INVALID_REQUEST);
    } else {
        next();
    }
};

export const loginValidator: RequestHandler = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required(),
        password: Joi.string()
            .min(8)
            .max(30)
            .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
            .required(),
    });
    const validation = schema.validate(req.body);
    if (validation.error) {
        console.error(validation.error);
        res.status(codes.BAD_REQUEST).send(errors.INVALID_REQUEST);
    } else {
        next();
    }
};

export const rotationValidator: RequestHandler = (req, res, next) => {
    const schema = Joi.object({
        refreshToken: Joi.string()
            .regex(/^(Bearer )[\w-]+\.[\w-]+\.[\w-]+$/)
            .required()
    });
    const validation = schema.validate(req.body);
    if (validation.error) {
        console.error(validation.error);
        res.status(codes.BAD_REQUEST).send(errors.INVALID_REQUEST);
    } else {
        next();
    }
};
