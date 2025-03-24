import { KyselyDatabaseConnection } from "../connection";
import { UserProfilePersistenceRepository } from "../../../services";
import { UserProfile } from "../../../models";
import { UUID } from "crypto";

export class KyselyProfilePersistecyRepository
    implements UserProfilePersistenceRepository
{
    constructor(public readonly conn: KyselyDatabaseConnection) {}

    async create(userUuid: UUID): Promise<void> {
        await this.conn
            .insertInto("profiles")
            .values({ user_uuid: userUuid })
            .execute();
    }

    update(profile: UserProfile): Promise<void> {
        throw new Error("Method not implemented.");
    }

    findByUserUUID(userUuid: UUID): Promise<UserProfile> {
        throw new Error("Method not implemented.");
    }
}
