import { UUID } from "crypto";
import {
    UserProfilePersistenceRepository,
    ProfilePhotoFilePersistenceRepository,
} from "./interfaces";

export class UpdateProfilePhotoDto {
    constructor(
        public userUuid: UUID,
        public photo: File,
    ) {}
}

export interface UpdateProfilePhotoDtoValidator {
    validate(dto: UpdateProfilePhotoDto): Promise<void>;
}

export class UpdateProfilePhoto {
    constructor(
        public profilePhotoFilePersistenceRepository: ProfilePhotoFilePersistenceRepository,
        public userProfilePersistenceRepository: UserProfilePersistenceRepository,
        public updateProfilePhotoDtoValidator: UpdateProfilePhotoDtoValidator,
    ) {}

    async execute(dto: UpdateProfilePhotoDto): Promise<string> {
        await this.updateProfilePhotoDtoValidator.validate(dto);
        const profile =
            await this.userProfilePersistenceRepository.findByUserUUID(
                dto.userUuid,
            );

        if (profile.profilePhotoUrl)
            await this.profilePhotoFilePersistenceRepository.delete(
                profile.profilePhotoUrl,
            );

        await this.profilePhotoFilePersistenceRepository.save(
            dto.userUuid,
            dto.photo,
        );

        profile.profilePhotoUrl = dto.userUuid;

        await this.userProfilePersistenceRepository.update(profile);

        return this.profilePhotoFilePersistenceRepository.getRealUrl(
            profile.profilePhotoUrl,
        );
    }
}
