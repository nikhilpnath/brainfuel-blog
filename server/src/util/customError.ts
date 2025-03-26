type ResponseError = Error & {
    status: number;
}

export const createError = (message: string, status: number) => {
    const error = new Error(message) as ResponseError;
    error.status = status;
    return error;
};