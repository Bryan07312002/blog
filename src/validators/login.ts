import { LoginRequestDto } from "../controllers/login";
import { RequestValidator } from "../controllers";
import { z, ZodError } from "zod";
import { toApiError } from "./errors";

export class ZodLoginValidator implements RequestValidator<LoginRequestDto> {
    validate(body: unknown): LoginRequestDto {
        const schema = z.object({
            username_or_email: z.string(),
            password: z.string(),
        });

        try {
            schema.parse(body);

            return new LoginRequestDto(
                (body as any).username_or_email,
                (body as any).password,
            );
        } catch (e) {
            if (e instanceof ZodError) throw toApiError(e);

            throw e;
        }
    }
}
