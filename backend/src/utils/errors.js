class ValidError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidError';
        this.statusCode = 400;
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

export { ValidError, NotFoundedError, ServerError };