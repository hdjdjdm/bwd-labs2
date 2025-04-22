import { ErrorCodes, ErrorMessages } from '@constants/Errors.js';

export default class CustomError extends Error {
    statusCode: number;

    constructor(errorCode: ErrorCodes, customMessage?: string) {
        const errorKey = ErrorCodes[errorCode] as keyof typeof ErrorMessages;
        const message = customMessage || ErrorMessages[errorKey] || 'Произошла неожиданная ошибка';
        super(message);
        this.name = 'CustomError';
        this.statusCode = errorCode;

        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
