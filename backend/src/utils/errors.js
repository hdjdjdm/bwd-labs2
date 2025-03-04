class ValidError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidError';
        this.statusCode = 400;
    }
}

class UnauthorizedError extends Error {
    constructor(message = 'Unauthorized access. No valid token provided.') {
        super(message);
        this.name = 'UnauthorizedError';
        this.statusCode = 401;
    }
}

class ForbiddenError extends Error {
    constructor(
        message = 'You do not have permission to access this resource.',
    ) {
        super(message);
        this.name = 'ForbiddenError';
        this.statusCode = 403;
    }
}

class NotFoundedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundedError';
        this.statusCode = 404;
    }
}

class ServerError extends Error {
    constructor(message = 'Internal Server Error') {
        super(message);
        this.name = 'ServerError';
        this.statusCode = 500;
    }
}

export {
    ValidError,
    NotFoundedError,
    UnauthorizedError,
    ForbiddenError,
    ServerError,
};
