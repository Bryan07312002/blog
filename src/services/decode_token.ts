import { UUID } from "crypto";
import { JwtRepository, Token } from ".";

export class DecodeToken {
    constructor(private jwtRepository: JwtRepository) {}

    execute(token: Token): { uuid: UUID } {
        return this.jwtRepository.decode(token);
    }
}
