import { UUID } from "crypto";
import {
    UserProfilePersistenceRepository,
    UserProfilePhotoFilePersistenceRepository,
} from "./interfaces";

export class UpdateProfilePhotoDto {
    constructor(
        public userUuid: UUID,
        public photo: Blob,
    ) {}
}

export interface UpdateProfilePhotoDtoValidator {
    validate(dto: UpdateProfilePhotoDto): Promise<void>;
}

export class UpdateProfilePhoto {
    constructor(
        public userProfilePhotoFilePersistenceRepository: UserProfilePhotoFilePersistenceRepository,
        public userProfilePersistenceRepository: UserProfilePersistenceRepository,
        public UpdateProfilePhotoDtoValidator: UpdateProfilePhotoDtoValidator,
    ) {}

    async execute(dto: UpdateProfilePhotoDto): Promise<void> {
        await this.UpdateProfilePhotoDtoValidator.validate(dto);
        const profile =
            await this.userProfilePersistenceRepository.findByUserUUID(
                dto.userUuid,
            );

        if (profile.profile_photo_url)
            await this.userProfilePhotoFilePersistenceRepository.delete(
                profile.profile_photo_url,
            );

        await this.userProfilePhotoFilePersistenceRepository.save(
            dto.userUuid,
            dto.photo,
        );

        profile.profile_photo_url = dto.userUuid;

        await this.userProfilePersistenceRepository.update(profile);
    }
}
