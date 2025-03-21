import { UUID, randomUUID } from "crypto";
import { UUIDGenerator } from "../services";

export class CryptoUuidGenerator implements UUIDGenerator {
    generate(): UUID {
        return randomUUID();
    }
}
