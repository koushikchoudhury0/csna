export interface MongoUpdateResult {
    acknowledged: boolean,
    modifiedCount: number,
    upsertedId: any,
    upsertedCount: number,
    matchedCount: number
}

export interface MongoDeleteResult {
    acknowledged: boolean,
    deletedCount: number
}