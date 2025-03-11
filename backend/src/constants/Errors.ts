enum ErrorCodes {
    BadRequest = 400,
    UnauthorizedError = 401,
    ForbiddenError = 403,
    NotFoundedError = 404,
    ConflictError = 409,
    ServerError = 500,
}

enum ErrorMessages {
    BadRequest = 'Bad request',
    UnauthorizedError = 'Unauthorized access. No valid token provided',
    ForbiddenError = 'You do not have permission to access this resource.',
    ConflictError = 'Conflict error, resource already exists',
    NotFoundedError = 'Resource not found',
    ServerError = 'Internal Server Error',
}

export { ErrorCodes, ErrorMessages };
