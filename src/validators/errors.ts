import { ApiError, ErrorType } from "../error";
import { ZodError } from "zod";

export function toApiError(err: ZodError): ApiError {
    if (err.issues[0].path.length == 0) {
        return new ApiError(422, err.issues[0].message, ErrorType.Validation);
    }

    const msg: Array<{ field?: string; message: string }> = [];

    err.issues.forEach((issue) => {
        msg.push({ field: issue.path[0].toString(), message: issue.message });
    });

    return new ApiError(422, err.message, ErrorType.Validation, msg);
}
