class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
    }
}

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
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

export { ValidationError, NotFoundError, ServerError };