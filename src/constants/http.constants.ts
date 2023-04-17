enum codes {
    BAD_REQUEST = 400,
    FORBIDDEN = 403,
    UNAUTHORIZED = 401,
    ERROR = 500
}

enum errors {
    INVALID_REQUEST = 'Invalid request',
    NO_SUCH_USER = 'No user found with this email address',
    EMAIL_EXISTS = 'User with same email address already exists',
    TITLE_EXISTS = 'Todo with same title already exists',
    NO_MATCH = 'No such record exists',
    NO_MODIFICATION = 'No change in record was provided',
    GENERIC = 'Something went wrong'
}

export { codes, errors };
