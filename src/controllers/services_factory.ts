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
    RegisterDto,
    Login,
    JwtRepository,
    DecodeToken,
    RetrieveFullUserProfile,
    UserProfilePhotoFilePersistenceRepository,
} from "../services";
import {
    ZodRegisterDtoValidator,
    ZodRegisterRequestValidator,
    ZodLoginValidator,
    ZodUUIDValidator,
} from "../validators";
import { CryptoUuidGenerator } from "../uuid";
import { RequestValidator } from ".";
import { JWTRepository } from "../jwt/jsonwebtoken_jwt_repository";
import { LoginRequestDto } from "./login";
import { FSUserProfilePhotoFilePersistenceRepository } from "../persistence/media/media";
import { UUID } from "crypto";

export class RepositoryFactory {
    constructor(
        public readonly databaseConnection: KyselyDatabaseConnection,
        public readonly hashOptions: { salt: number },
        public readonly jwtOption: { secret: string; expiresIn: string },
        public readonly mediaPersistencyOptions: {
            basePath: string;
            baseUrl: URL;
        },
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

    createJwtRepository(): JwtRepository {
        return new JWTRepository(
            this.jwtOption.secret,
            this.jwtOption.expiresIn,
        );
    }

    createUserProfilePhotoFilePersistenceRepository(): UserProfilePhotoFilePersistenceRepository {
        return new FSUserProfilePhotoFilePersistenceRepository(
            this.mediaPersistencyOptions.basePath,
            this.mediaPersistencyOptions.baseUrl,
        );
    }
}

export class ValidatorFactory {
    createRegisterDtoValidator(): RegisterDtoValidator {
        return new ZodRegisterDtoValidator();
    }

    createRegisterRequestValidator(): RequestValidator<RegisterDto> {
        return new ZodRegisterRequestValidator();
    }

    createLoginRequestValidator(): RequestValidator<LoginRequestDto> {
        return new ZodLoginValidator();
    }

    createUUIDValidator(): RequestValidator<{ uuid: UUID }> {
        return new ZodUUIDValidator();
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

    createLoginService(): Login {
        return new Login(
            this.repositoryFactory.createUserPersistenceRepository(),
            this.repositoryFactory.createHashRepository(),
            this.repositoryFactory.createJwtRepository(),
        );
    }

    createDecodeToken(): DecodeToken {
        return new DecodeToken(this.repositoryFactory.createJwtRepository());
    }

    createRetrieveFullUserProfile(): RetrieveFullUserProfile {
        return new RetrieveFullUserProfile(
            this.repositoryFactory.createUserPersistenceRepository(),
            this.repositoryFactory.createUserProfilePhotoFilePersistenceRepository(),
        );
    }
}
