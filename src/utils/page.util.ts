export const createDataWithPageMeta = (
    data: any,
    documentCount: number,
    currentPage: number,
    pageSize: number
) => ({
    data,
    meta: {
        totalItems: documentCount,
        currentPage,
        pageSize
    }
});