import mongoose from "mongoose";
import { postsModel } from "../models/posts.model.js";
import { createDataWithPageMeta } from "../../utils/page.util.js";
import { MongoDeleteResult, MongoUpdateResult } from "../../types/mongo-results.interface.js";
import { CustomError } from "../../types/custom-error.class.js";
import { errors } from "../../constants/http.constants.js";

export const updatePost = (
    userId: string,
    id: string,
    content: string
) => {
    return postsModel.updateOne(
        {
            _id: id,
            user: userId
        },
        {
            content
        }
    );
};

export const handlePostUpdate = (
    data: MongoUpdateResult
): CustomError | boolean => {
    if (!data.matchedCount) {
        return new CustomError(errors.NO_MATCH)
    }
    if (!data.modifiedCount && !data.upsertedCount) {
        return new CustomError(errors.NO_MODIFICATION)
    }
    return true;
}

export const handlePostDelete = (
    data: MongoDeleteResult
): CustomError | boolean => {
    if (!data.deletedCount) {
        return new CustomError(errors.NO_MATCH)
    }
    return true;
}

export const getPostsByUserId = async (
    userId: string,
    page: number,
    size: number
) => {
    const filter = { user: userId };
    const data = await postsModel.find(filter, '-comments')
        .skip(page * size)
        .limit(size);
    const documentCount = Number(
        await postsModel.countDocuments(filter)
    );
    return createDataWithPageMeta(
        data,
        documentCount,
        page + 1,
        size
    )
}