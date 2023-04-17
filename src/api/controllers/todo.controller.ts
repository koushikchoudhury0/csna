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
const { ERROR } = HTTPCodes;

export const router = Router();

// Read Own Todos
router.get('/', pageSanitizer, (req, res) => {
    const user = getUserFromRequest(
        String(req.headers['access'])
    );
    getTodosByUserId(
        user.id,
        Number(req.query['page']),
        Number(req.query['size'])
    )
        .then((data) => res.send(data))
        .catch((err) => res.status(ERROR).send(
            handleGenericError(err)
        ));
});

// Read Other User's Todos
router.get(
    '/users/:userid',
    getOtherTodoValidator,
    pageSanitizer,
    (req, res) => {
        getTodosByUserId(
            req.params.userid,
            Number(req.query['page']),
            Number(req.query['size'])
        )
            .then((data) => res.send(data))
            .catch((err) => res.status(ERROR).send(
                handleGenericError(err)
            ));
    });

// Read Own or Other User's single item
router.get('/:id', getTodoValidator, (req, res) => {
    todoModel.findById(req.params.id)
        .then((data) => res.send(data))
        .catch((err) => res.status(ERROR).send(
            handleGenericError(err)
        ));
});

// Add an item
router.post('/', addTodoValidator, (req, res) => {
    const user = getUserFromRequest(
        String(req.headers['access'])
    );
    const { title, description, complete } = req.body;
    createTodo(user.id, title, description, complete)
        .then((data) => res.send(data))
        .catch((err) => res.status(ERROR).send(
            handleWriteTodoError(err)
        ));
});

// Edit an item
router.put('/:id', updateTodoValidator, (req, res) => {
    const user = getUserFromRequest(
        String(req.headers['access'])
    );
    const { title, description, complete } = req.body;
    updateTodo(
        user.id,
        req.params.id,
        title,
        description,
        complete
    )
        .then((data: MongoUpdateResult) => {
            const result = handleTodoUpdate(data);
            if (result instanceof CustomError) {
                res.status(ERROR).send(result.msg);
            } else res.send();
        })
        .catch((err) => res.status(ERROR).send(
            handleWriteTodoError(err)
        ));
});

// Delete post
router.delete(
    '/:id',
    deleteTodoValidator,
    (req, res) => {
        const user = getUserFromRequest(
            String(req.headers['access'])
        );
        todoModel.deleteOne({
            _id: req.params.id,
            user: user.id
        }).then((data: MongoDeleteResult) => {
            const result = handleTodoDelete(data);
            if (result instanceof CustomError) {
                res.status(ERROR).send(result.msg);
            } else res.send();
        }).catch((err) => {
            res.status(ERROR).send(
                handleGenericError(err)
            );
        });
    }
);
