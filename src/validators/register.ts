import { RegisterDto, RegisterDtoValidator } from "../services";
import { z, ZodError } from "zod";
import { toApiError } from "./errors";

// check for typeing
export class ZodRegisterRequestValidator implements RegisterDtoValidator {
    async validate(dto: RegisterDto): Promise<void> {
        const schema = z.object({
            username: z.string(),
            email: z.string(),
            passoword: z.string(),
        });

        try {
            schema.parse(dto);
        } catch (e) {
            if (e instanceof ZodError) throw toApiError(e);

            throw e;
        }
    }
}

export class ZodRegisterDtoValidator implements RegisterDtoValidator {
    async validate(dto: RegisterDto): Promise<void> {
        const schema = z.object({
            username: z.string().min(5).max(255),
            email: z.string().min(5).max(255),
            passoword: z.string().min(5).max(100),
        });

        try {
            schema.parse(dto);
        } catch (e) {
            if (e instanceof ZodError) throw toApiError(e);

            throw e;
        }
    }
}
