import { Router } from 'express';
import { codes as HTTPCodes } from '../../constants/http.constants.js';
import { getUserFromRequest } from '../../utils/auth.utils.js';
import { handleWriteTodoError, handleGenericError } from '../helpers/error.helper.js';
import { pageSanitizer } from '../sanitizers/page.sanitizer.js';
import { MongoDeleteResult, MongoUpdateResult } from '../../types/mongo-results.interface.js';
import { CustomError } from '../../types/custom-error.class.js';
import { postsModel } from '../models/posts.model.js';
import { addCommentValidator, deleteCommentValidator, getUserPostValidator, updatePostValidator, writePostValidator } from '../validators/posts.validator.js';
import { getPostsByUserId, handlePostDelete, handlePostUpdate, updatePost } from '../helpers/posts.helper.js';
import mongoose from 'mongoose';
const { ERROR } = HTTPCodes;

export const router = Router();


// Add an item
router.post('/', writePostValidator, (req, res) => {
    const user = getUserFromRequest(
        String(req.headers['access'])
    );
    const { content } = req.body;
    postsModel.create({
        content,
        user: user.id
    })
        .then((data) => res.send(data))
        .catch((err) => res.status(ERROR).send(
            handleGenericError(err)
        ));
});

// Edit an item
router.put(
    '/:id',
    updatePostValidator,
    writePostValidator,
    (req, res) => {
        const user = getUserFromRequest(
            String(req.headers['access'])
        );
        const { content } = req.body;
        updatePost(
            user.id,
            req.params.id,
            content
        )
            .then((data: MongoUpdateResult) => {
                const result = handlePostUpdate(data);
                if (result instanceof CustomError) {
                    res.status(ERROR).send(result.msg);
                } else res.send();
            })
            .catch((err) => res.status(ERROR).send(
                handleGenericError(err)
            ));
    }
);

// Add comment
router.post(
    '/:id/comment',
    updatePostValidator,
    addCommentValidator,
    (req, res) => {
        const user = getUserFromRequest(
            String(req.headers['access'])
        );
        const comment = {
            _id: new mongoose.Types.ObjectId(),
            user: user.id,
            text: req.body.text
        };
        postsModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: { comments: comment }
            }
        )
            .then(() => res.send({
                postId: req.params.id,
                comment
            }))
            .catch((err) => res.status(ERROR).send(
                handleGenericError(err)
            ));
    }
);

// Delete comment
router.delete(
    '/:id/comment/:commentid',
    deleteCommentValidator,
    (req, res) => {
        const user = getUserFromRequest(
            String(req.headers['access'])
        );
        const comment = {
            _id: req.params.commentid,
            user: user.id
        };
        postsModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: { comments: comment }
            }
        )
            .then(() => {
                res.send({
                    postId: req.params.id,
                    comment
                });
            })
            .catch((err) => res.status(ERROR).send(
                handleWriteTodoError(err)
            ));
    }
);

// Delete post
router.delete(
    '/:id',
    updatePostValidator,
    (req, res) => {
        const user = getUserFromRequest(
            String(req.headers['access'])
        );
        postsModel.deleteOne({
            _id: req.params.id,
            user: user.id
        }).then((data: MongoDeleteResult) => {
            const result = handlePostDelete(data);
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

// View posts of a user
router.get(
    '/user/:userid',
    getUserPostValidator,
    pageSanitizer,
    (req, res) => {
        getPostsByUserId(
            req.params.userid,
            Number(req.query['page']),
            Number(req.query['size'])
        )
            .then((data) => res.send(data))
            .catch((err) => res.status(ERROR).send(
                handleGenericError(err)
            ));
    }
);

// View comments of a post
router.get('/:id/comments', updatePostValidator, (req, res) => {
    postsModel.find({
        _id: req.params.id
    }, 'comments')
        .then(data => res.send(data))
        .catch((err) => res.status(ERROR).send(
            handleGenericError(err)
        ));
});


