import { UUID } from "crypto";
import { UpdateProfileDtoValidator, UserProfilePersistenceRepository } from ".";
import { UserProfile } from "../models";

export class UpdateProfileDTO {
    constructor(
        public userUuid: UUID,
        public profile: {
            title?: string;
            bio?: string;
            lives_in?: string;
            works_at?: string;
            studie_at?: string;
        },
    ) {}
}

export class UpdateProfile {
    constructor(
        private readonly userProfilePersistenceRepository: UserProfilePersistenceRepository,
        private readonly UpdateProfileDtoValidator: UpdateProfileDtoValidator,
    ) {}

    async execute(dto: UpdateProfileDTO): Promise<UserProfile> {
        await this.UpdateProfileDtoValidator.validate(dto);

        const profile =
            await this.userProfilePersistenceRepository.findByUserUUID(
                dto.userUuid,
            );

        if (dto.profile.title) profile.title = dto.profile.title;
        if (dto.profile.bio) profile.bio = dto.profile.bio;
        if (dto.profile.lives_in) profile.lives_in = dto.profile.lives_in;
        if (dto.profile.works_at) profile.works_at = dto.profile.works_at;
        if (dto.profile.studie_at) profile.studie_at = dto.profile.studie_at;

        await this.userProfilePersistenceRepository.update(profile);

        return profile;
    }
}
