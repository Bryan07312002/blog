export enum ErrorType {
    Validation = "VALIDATION_ERROR",
    Unathorized = "VALIDATION_ERROR",
    NotFound = "NOT_FOUND",
    Forbidden = "FORBIDDEN",
    Interal = "INTERNAL_ERROR",
    Conflict = "CONFLICT",
}

export class ApiError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public error: ErrorType,
        public details?: Array<{ field?: string; message: string }>,
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }

    toJSON() {
        return {
            statusCode: this.statusCode,
            message: this.message,
            error: this.error,
            details: this.details,
            timestamp: new Date().toISOString(),
        };
    }
}

// Validation Error (400)
export function validationError(
    message: string = "Invalid input data",
    details?: Array<{ field?: string; message: string }>,
): ApiError {
    return new ApiError(400, message, ErrorType.Validation, details);
}

// Not Found Error (404)
export function notFoundError(
    message: string = "Resource not found",
    details?: Array<{ field?: string; message: string }>,
): ApiError {
    return new ApiError(404, message, ErrorType.NotFound, details);
}

// Unauthorized Error (401)
export function unauthorizedError(
    message: string = "Authentication required",
    details?: Array<{ field?: string; message: string }>,
): ApiError {
    return new ApiError(401, message, ErrorType.Unathorized, details);
}

// Forbidden Error (403)
export function forbiddenError(
    message: string = "Insufficient permissions",
    details?: Array<{ field?: string; message: string }>,
): ApiError {
    return new ApiError(403, message, ErrorType.Forbidden, details);
}

// Internal Server Error (500)
export function internalServerError(
    message: string = "Internal Server Error",
    details?: Array<{ field?: string; message: string }>,
): ApiError {
    return new ApiError(500, message, ErrorType.Interal, details);
}

// Conflict Error (409)
export function conflictError(
    message: string = "Resource conflict",
    details?: Array<{ field?: string; message: string }>,
): ApiError {
    return new ApiError(409, message, ErrorType.Conflict, details);
}
