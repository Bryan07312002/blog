import { UUID } from "crypto";
import { User } from "../../../models";
import { FullUserProfile, UserPersistenceRepository } from "../../../services";
import { KyselyDatabaseConnection } from "../connection";

export class KyselyUserPersistenceRepository
    implements UserPersistenceRepository
{
    constructor(private readonly conn: KyselyDatabaseConnection) {}

    async create(user: User): Promise<void> {
        await this.conn
            .insertInto("users")
            .values({
                uuid: user.uuid,
                email: user.email,
                username: user.username,
                role: user.userRole,
                state: user.state,
                password: user.password,
            })
            .execute();
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
