import { Router } from 'express';
import { usersModel } from '../../models/users.model.js';
import { codes } from '../../../constants/http.constants.js';
import { handleGenericError } from '../../helpers/error.helper.js';

const router = Router();

router.patch('/:id', (req, res) => {
    const { firstName, lastName } = req.body;
    usersModel.updateOne({
        _id: req.params.id
    }, {
        firstName,
        lastName
    })
        .then((data) => res.send(data))
        .catch((err) => res.status(codes.ERROR).send(
            handleGenericError(err)
        ));
});

export { router };
