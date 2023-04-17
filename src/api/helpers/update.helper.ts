import { CustomError } from "../../types/custom-error.class.js";
import { MongoUpdateResult } from "../../types/mongo-results.interface.js";

const handleUpdate = (
    data: MongoUpdateResult,
    errorOnNoMatch: boolean
) => {
    if (!data.matchedCount) {
        return new CustomError('')
    }
}