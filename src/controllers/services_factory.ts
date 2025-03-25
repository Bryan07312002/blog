import { FSProfilePhotoFilePersistenceRepository } from "../persistence/media/media";
import { JWTRepository } from "../jwt/jsonwebtoken_jwt_repository";
import { CryptoHashRepository } from "../hash";
import { CryptoUuidGenerator } from "../uuid";
import { LoginRequestDto } from "./login";
import { RequestValidator } from ".";
import { UUID } from "crypto";
import {
    KyselyDatabaseConnection,
    KyselyUserPersistenceRepository,
    KyselyProfilePersistecyRepository,
} from "../persistence/database";
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
    ProfilePhotoFilePersistenceRepository,
    UpdateProfilePhoto,
} from "../services";
import {
    ZodRegisterDtoValidator,
    ZodRegisterRequestValidator,
    ZodLoginValidator,
    ZodUUIDValidator,
} from "../validators";

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

    createProfilePhotoFilePersistenceRepository(): ProfilePhotoFilePersistenceRepository {
        return new FSProfilePhotoFilePersistenceRepository(
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
            this.repositoryFactory.createProfilePhotoFilePersistenceRepository(),
        );
    }

    createUpdateProfilePhoto(): UpdateProfilePhoto {
        return new UpdateProfilePhoto(
            this.repositoryFactory.createProfilePhotoFilePersistenceRepository(),
            this.repositoryFactory.createProfilePersistenceRepository(),
            // TODO: change this
            { validate: async () => {} },
        );
    }
}
