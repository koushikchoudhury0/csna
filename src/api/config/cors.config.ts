import { CorsOptions } from 'cors';

const whitelistedDomains: string[] = [
    'http://assess.cutshort.com',
    'http://verify.cutshort.com'
];

export const allowMultipleDomains: CorsOptions = {
    origin: function (url, callback) {
        if (whitelistedDomains.indexOf(url || '') !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

export const allowSingleDomain: CorsOptions = {
    origin: 'http://assess.cutshort.com'
};