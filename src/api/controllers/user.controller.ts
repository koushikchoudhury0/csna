import { Router } from 'express';
import { codes as HTTPCodes } from '../../constants/http.constants.js';
import { getUserFromRequest } from '../../utils/auth.utils.js';
import { todoModel } from '../models/todo.model.js';
import { createTodo, getTodosByUserId, handleTodoDelete, handleTodoUpdate, updateTodo } from '../helpers/todo.helper.js';
import { addTodoValidator, deleteTodoValidator, getOtherTodoValidator, getTodoValidator, updateTodoValidator } from '../validators/todo.validator.js';
import { handleWriteTodoError, handleGenericError } from '../helpers/error.helper.js';
import { pageSanitizer } from '../sanitizers/page.sanitizer.js';
import { MongoDeleteResult, MongoUpdateResult } from '../../types/mongo-results.interface.js';
import { CustomError } from '../../types/custom-error.class.js';
import { usersModel } from '../models/users.model.js';
const { ERROR } = HTTPCodes;

export const router = Router();

// Read Own Todos
router.get('/', (req, res) => {
    const user = getUserFromRequest(
        String(req.headers['access'])
    );
    usersModel.find({
        _id: {
            $ne: user.id
        }
    }, '-password -email')
        .then((data) => res.send(data))
        .catch((err) => res.status(ERROR).send(
            handleGenericError(err)
        ));
});
