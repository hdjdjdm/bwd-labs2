class ValidError extends Error {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'ValidError';
        this.statusCode = 400;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

class UnauthorizedError extends Error {
    statusCode: number;

    constructor(message: string = 'Unauthorized access. No valid token provided.') {
        super(message);
        this.name = 'UnauthorizedError';
        this.statusCode = 401;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

class ForbiddenError extends Error {
    statusCode: number;

    constructor(message: string = 'You do not have permission to access this resource.') {
        super(message);
        this.name = 'ForbiddenError';
        this.statusCode = 403;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

class NotFoundedError extends Error {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'NotFoundedError';
        this.statusCode = 404;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

class ServerError extends Error {
    statusCode: number;

    constructor(message: string = 'Internal Server Error') {
        super(message);
        this.name = 'ServerError';
        this.statusCode = 500;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export { ValidError, NotFoundedError, UnauthorizedError, ForbiddenError, ServerError };
//todo Переместить ошибки в enum
