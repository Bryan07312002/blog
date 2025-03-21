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
    RegisterDtoValidator,
    UUIDGenerator,
} from "../services";
import { ZodRegisterDtoValidator } from "../validators";
import { CryptoUuidGenerator } from "../uuid";

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

export class ValidatorFactory {
    createRegisterDtoValidator(): RegisterDtoValidator {
        return new ZodRegisterDtoValidator();
    }
}

export class UUIDGeneratorFactory {
    createUUIDGenerator(): UUIDGenerator {
        return new CryptoUuidGenerator();
    }
}

export class ServiceFactory {
    constructor(
        public repositoryFactory: RepositoryFactory,
        public validatorFactory: ValidatorFactory,
        public uuiDGeneratorFactory: UUIDGeneratorFactory,
    ) {}

    createRegisterService(): Register {
        return new Register(
            this.repositoryFactory.createUserPersistenceRepository(),
            this.repositoryFactory.createProfilePersistenceRepository(),
            this.repositoryFactory.createHashRepository(),
            this.validatorFactory.createRegisterDtoValidator(),
            this.uuiDGeneratorFactory.createUUIDGenerator(),
        );
    }
}
