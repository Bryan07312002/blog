import { RequestValidator } from "../controllers";
import { toApiError } from "./errors";
import { z, ZodError } from "zod";
import { UUID } from "crypto";

export class ZodUUIDValidator implements RequestValidator<{ uuid: UUID }> {
    validate(body: unknown): { uuid: UUID } {
        const schema = z.object({
            uuid: z.string().uuid(),
        });

        try {
            schema.parse(body);

            return { uuid: (body as any).uuid };
        } catch (e) {
            if (e instanceof ZodError) throw toApiError(e);

            throw e;
        }
    }
}
