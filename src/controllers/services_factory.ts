import {
    KyselyDatabaseConnection,
    KyselyUserPersistenceRepository,
    KyselyProfilePersistecyRepository,
} from "../persistence/database";
import { CryptoHashRepository } from "../hash";
import {
    Register,
    UserPersistenceRepository,
    UserProfilePersistenceRepository,
    HashRepository,
} from "../services";

export class RepositoryFactory {
    constructor(
        public readonly databaseConnection: KyselyDatabaseConnection,
        public readonly hashOptions: { salt: number },
    ) {}

    createUserPersistenceRepository(): UserPersistenceRepository {
        return new KyselyUserPersistenceRepository(this.databaseConnection);
    }

    createProfilePersistenceRepository(): UserProfilePersistenceRepository {
        return new KyselyProfilePersistecyRepository(this.databaseConnection);
    }

    createHashRepository(): HashRepository {
        return new CryptoHashRepository(this.hashOptions.salt);
    }
}

export class ServiceFactory extends RepositoryFactory {
    createRegisterService(): Register {
        throw "";

        new Register(
            this.createUserPersistenceRepository(),
            this.createProfilePersistenceRepository(),
            this.createHashRepository(),
        );
    }
}
