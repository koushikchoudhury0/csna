import mongoose from "mongoose";
import { todoModel } from "../models/todo.model.js";
import { createDataWithPageMeta } from "../../utils/page.util.js";
import { MongoDeleteResult, MongoUpdateResult } from "../../types/mongo-results.interface.js";
import { CustomError } from "../../types/custom-error.class.js";
import { errors } from "../../constants/http.constants.js";

export const getTodosByUserId = async (
    userId: string,
    page: number,
    size: number
) => {
    const filter = { user: userId };
    const data = await todoModel.find(filter)
        .skip(page * size)
        .limit(size);
    const documentCount = Number(
        await todoModel.countDocuments(filter)
    );
    return createDataWithPageMeta(
        data,
        documentCount,
        page + 1,
        size
    )
};

export const updateTodo = (
    userId: string,
    id: string,
    title: string | undefined,
    description: string | undefined,
    complete: boolean | undefined
) => {
    return todoModel.updateOne(
        {
            _id: id,
            user: userId
        },
        {
            title,
            description,
            complete,
        }
    );
};

export const createTodo = (
    userId: string,
    title: string,
    description: string | undefined,
    complete: boolean | undefined
) => {
    return todoModel.create({
        title,
        description,
        complete,
        user: new mongoose.Types.ObjectId(userId)
    });
};

export const handleTodoUpdate = (
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

export const handleTodoDelete = (
    data: MongoDeleteResult
): CustomError | boolean => {
    if (!data.deletedCount) {
        return new CustomError(errors.NO_MATCH)
    }
    return true;
}