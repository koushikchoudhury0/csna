import { VERBOSITY } from "../../constants/error.constants.js";
import { codes as MongoDBCodes } from '../../constants/mongodb.constants.js';
import { errors as HTTPErrors } from '../../constants/http.constants.js';
import { CustomError } from "../../types/custom-error.class.js";

const {
    GENERIC,
    EMAIL_EXISTS,
    NO_SUCH_USER,
    TITLE_EXISTS
} = HTTPErrors;

const executeErrorVerbosity = (
    verbosity: VERBOSITY,
    err: any
) => {
    switch (verbosity) {
        case VERBOSITY.MSG_ONLY:
            console.error(err.msg);
            break;
        case VERBOSITY.SUPPRESS:
            // Don't do anything
            break;
        default:
            // Resolves to VERBOSITY.STACK_TRACE
            console.error(err);
    }
}

export const handleSignUpError = (
    err: any, verbosity:
        VERBOSITY = VERBOSITY.STACK_TRACE
) => {
    executeErrorVerbosity(verbosity, err);
    return err.code === MongoDBCodes.DUPLICATE
        ? EMAIL_EXISTS
        : GENERIC
}

export const handleLoginError = (
    err: any, verbosity:
        VERBOSITY = VERBOSITY.STACK_TRACE
) => {
    executeErrorVerbosity(verbosity, err);
    return err instanceof CustomError
        ? NO_SUCH_USER
        : GENERIC
}

export const handleWriteTodoError = (
    err: any, verbosity:
        VERBOSITY = VERBOSITY.STACK_TRACE
) => {
    executeErrorVerbosity(verbosity, err);
    return err.code === MongoDBCodes.DUPLICATE
        ? TITLE_EXISTS
        : GENERIC
}

export const handleGenericError = (
    err: any, verbosity:
        VERBOSITY = VERBOSITY.STACK_TRACE
) => {
    executeErrorVerbosity(verbosity, err);
    return GENERIC;
}