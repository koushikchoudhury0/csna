import { RequestHandler } from "express";
import Joi from 'joi';
import { codes, errors } from '../../constants/http.constants.js';

export const writePostValidator: RequestHandler = (
    req, res, next
) => {
    const schema = Joi.object({
        content: Joi.string()
            .min(1)
            .max(1000)
            .regex(/^[a-z0-9 #,.'-]+$/i)
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

export const updatePostValidator: RequestHandler = (
    req, res, next
) => {
    const schema = Joi.object().keys({
        id: Joi.string()
            .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
            .required()
    });
    const validation = schema.validate(req.params);
    if (validation.error) {
        console.error(validation.error);
        res.status(codes.BAD_REQUEST).send(errors.INVALID_REQUEST);
    } else {
        next();
    }
};

export const getUserPostValidator: RequestHandler = (
    req, res, next
) => {
    const schema = Joi.object().keys({
        userid: Joi.string()
            .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
            .required()
    });
    const validation = schema.validate(req.params);
    if (validation.error) {
        console.error(validation.error);
        res.status(codes.BAD_REQUEST).send(errors.INVALID_REQUEST);
    } else {
        next();
    }
};

export const deleteCommentValidator: RequestHandler = (
    req, res, next
) => {
    const schema = Joi.object().keys({
        id: Joi.string()
            .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
            .required(),
        commentid: Joi.string()
            .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
            .required()
    });
    const validation = schema.validate(req.params);
    if (validation.error) {
        console.error(validation.error);
        res.status(codes.BAD_REQUEST).send(errors.INVALID_REQUEST);
    } else {
        next();
    }
};

export const addCommentValidator: RequestHandler = (
    req, res, next
) => {
    const schema = Joi.object({
        text: Joi.string()
            .min(1)
            .max(200)
            .regex(/^[a-z0-9 #,.'-]+$/i)
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