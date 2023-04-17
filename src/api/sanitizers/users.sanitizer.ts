import { RequestHandler } from 'express';
import { hash } from '../../utils/cryptic.utils.js';

const passwordSanitizer: RequestHandler = (req, res, next) => {
    req.body.password = hash(req.body.password);
    next();
};

export { passwordSanitizer };
