import crypto from 'crypto';

const hash = (password: string): string => {
    const salt = process.env.SALT || '';
    return crypto.pbkdf2Sync(
        password,
        salt,
        1000,
        64,
        `sha512`
    ).toString(`hex`);
};

export { hash };