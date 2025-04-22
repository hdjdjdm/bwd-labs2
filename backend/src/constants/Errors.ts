enum ErrorCodes {
    BadRequest = 400,
    UnauthorizedError = 401,
    ForbiddenError = 403,
    NotFoundedError = 404,
    ConflictError = 409,
    ServerError = 500,
}

enum ErrorMessages {
    BadRequest = 'Плохой запрос',
    UnauthorizedError = 'Несанкционированный доступ. Не предоставлен действительный токен',
    ForbiddenError = 'У вас нет разрешения на доступ к этому ресурсу.',
    ConflictError = 'Ошибка конфликта, ресурс уже существует',
    NotFoundedError = 'Ресурс не найден',
    ServerError = 'Внутренняя ошибка сервера',
}

export { ErrorCodes, ErrorMessages };
