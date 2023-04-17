import { RequestHandler } from "express";
import { DEFAULT_PAGE_SIZE } from "../config/limit.config.js";

export const pageSanitizer: RequestHandler = (req, res, next) => {
    let page = Math.max(
        Number(req.query['page']) || 1,
        1
    );
    req.query['page'] = String(page - 1);
    let size = Math.max(
        Number(req.query['size']) || DEFAULT_PAGE_SIZE,
        DEFAULT_PAGE_SIZE
    );
    req.query['size'] = String(size);
    next();
}
