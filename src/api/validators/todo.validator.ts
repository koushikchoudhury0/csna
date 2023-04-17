import { RequestHandler } from 'express';
import Joi from 'joi';
import { codes, errors } from '../../constants/http.constants.js';

export const addTodoValidator: RequestHandler = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string()
            .min(1)
            .max(100)
            .regex(/^[a-z0-9 ,.'-]+$/i)
            .required(),
        description: Joi.string()
            .min(1)
            .max(500)
            .regex(/^[a-z0-9 ,.'-]+$/i)
            .default(''),
        complete: Joi.boolean()
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

export const updateTodoValidator: RequestHandler = (req, res, next) => {

    const paramsSchema = Joi.object().keys({
        id: Joi.string()
            .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
            .required()
    });
    const paramsValidation = paramsSchema.validate(req.params);
    if (paramsValidation.error) {
        console.error(paramsValidation.error);
        res.status(codes.BAD_REQUEST).send(errors.INVALID_REQUEST);
        return;
    }

    const schema = Joi.object({
        title: Joi.string()
            .min(1)
            .max(100)
            .regex(/^[a-z0-9 ,.'-]+$/i),
        description: Joi.string()
            .min(0)
            .max(500)
            .regex(/^[a-z0-9 ,.'-]+$/i),
        complete: Joi.boolean()
    }).min(1);
    const validation = schema.validate(req.body);
    if (validation.error) {
        console.error(validation.error);
        res.status(codes.BAD_REQUEST).send(errors.INVALID_REQUEST);
    } else {
        next();
    }
};

export const getTodoValidator: RequestHandler = (req, res, next) => {
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
}

export const getOtherTodoValidator: RequestHandler = (req, res, next) => {
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
}

export const deleteTodoValidator: RequestHandler = (req, res, next) => {
    const paramsSchema = Joi.object().keys({
        id: Joi.string()
            .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
            .required()
    });
    const paramsValidation = paramsSchema.validate(req.params);
    if (paramsValidation.error) {
        console.error(paramsValidation.error);
        res.status(codes.BAD_REQUEST).send(errors.INVALID_REQUEST);
    } else {
        next();
    }
}

