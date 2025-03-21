import { UUID } from "crypto";
import { User } from "../../../models";
import { FullUserProfile, UserPersistenceRepository } from "../../../services";
import { KyselyDatabaseConnection } from "../connection";

export class KyselyUserPersistenceRepository
    implements UserPersistenceRepository
{
    constructor(private readonly conn: KyselyDatabaseConnection) {}

    create(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }

    findByUsernameOrEmail(usernameOrEmail: string): Promise<User> {
        throw new Error("Method not implemented.");
    }

    findByUUID(uuid: UUID): Promise<User> {
        throw new Error("Method not implemented.");
    }

    findFullUserByUUID(uuid: UUID): Promise<FullUserProfile> {
        throw new Error("Method not implemented.");
    }
}
