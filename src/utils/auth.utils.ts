import JWT from 'jsonwebtoken';
import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';
import { USER_SUBJECT } from '../constants/auth.constants.js';

const { ADMIN, GENERAL } = USER_SUBJECT;


const createAccessToken = (
    id: mongoose.Types.ObjectId,
    name: string,
    admin: boolean,
    tokenId: string
) => {
    const accessToken = JWT.sign(
        {
            id, name, tokenId
        },
        process.env.JWT_ACCESS_SECRET || '',
        {
            expiresIn: process.env.JWT_ACCESS_EXPIRY || '',
            audience: process.env.JWT_AUDIENCE || '',
            issuer: process.env.JWT_ISSUER || '',
            subject: admin ? ADMIN : GENERAL
        }
    );
    return accessToken;
};

const createRefreshToken = (
    id: mongoose.Types.ObjectId,
    name: string,
    admin: boolean,
    tokenId: string
) => {
    const accessToken = JWT.sign(
        {
            id, name, tokenId
        },
        process.env.JWT_REFRESH_SECRET || '',
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRY || '',
            audience: process.env.JWT_AUDIENCE || '',
            issuer: process.env.JWT_ISSUER || '',
            subject: admin ? ADMIN : GENERAL
        }
    );
    return accessToken;
};

const getTokens = (
    id: mongoose.Types.ObjectId,
    name: string,
    admin: boolean,
) => {
    const tokenId = uuid();
    const refreshToken = createRefreshToken(id, name, admin, tokenId);
    const accessToken = createAccessToken(id, name, admin, tokenId);
    return {
        refreshToken,
        accessToken
    };
};

const verifyAccessTokens = (
    token: string
) => {
    return JWT.verify(
        token.split(" ")[1],
        String(process.env.JWT_ACCESS_SECRET)
    );
};

const rotateTokens = (_refreshToken: string) => {
    const data: any = JWT.verify(
        _refreshToken.split(" ")[1],
        String(process.env.JWT_REFRESH_SECRET)
    );
    // TODO: Use Redis here to validate 
    //       if the id of the refresh token is active
    const { id, name, sub } = data;
    const admin = sub === USER_SUBJECT.ADMIN;
    return getTokens(id, name, admin);
};

const getUserFromRequest = (accessHeader: string) => {
    const { id, name } = JSON.parse(accessHeader);
    return { id, name };
};

export {
    getTokens,
    verifyAccessTokens,
    rotateTokens,
    getUserFromRequest
};