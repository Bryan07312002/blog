import { UUID } from "crypto";
import { JwtRepository, Token } from "../services";
import { sign, verify } from "jsonwebtoken";
import { unauthorizedError } from "../error";

export class JWTRepository implements JwtRepository {
    constructor(
        public secret: string,
        public expiresIn: string,
    ) {}

    sign(userUUID: UUID): Token {
        return sign({ uuid: userUUID }, this.secret, {
            expiresIn: this.expiresIn as any,
        });
    }

    decode(token: Token): { uuid: UUID } {
        try {
            return verify(token, this.secret) as { uuid: UUID };
        } catch (error) {
            throw unauthorizedError();
        }
    }
}
