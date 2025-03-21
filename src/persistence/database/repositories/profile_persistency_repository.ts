import { KyselyDatabaseConnection } from "../connection";
import { UserProfilePersistenceRepository } from "../../../services";
import { UserProfile } from "../../../models";
import { UUID } from "crypto";

export class KyselyProfilePersistecyRepository
    implements UserProfilePersistenceRepository
{
    constructor(
        public readonly kyselyDatabaseConnection: KyselyDatabaseConnection,
    ) {}

    create(userUuid: UUID): Promise<void> {
        throw new Error("Method not implemented.");
    }

    update(profile: UserProfile): Promise<void> {
        throw new Error("Method not implemented.");
    }

    findByUserUUID(userUuid: UUID): Promise<UserProfile> {
        throw new Error("Method not implemented.");
    }
}
