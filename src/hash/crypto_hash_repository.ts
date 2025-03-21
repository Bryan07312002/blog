import { HashRepository } from "../services";
import crypto from "crypto";

export class CryptoHashRepository implements HashRepository {
    constructor(private readonly salt: number) {}

    async hash(str: string): Promise<string> {
        const hash = crypto
            .createHmac("sha256", this.salt.toString())
            .update(str)
            .digest("hex");

        return hash;
    }

    async compare(hashed: string, notHashed: string): Promise<boolean> {
        const inputHash = crypto
            .createHmac("sha256", this.salt.toString())
            .update(notHashed)
            .digest("hex");

        return inputHash === hashed;
    }
}
