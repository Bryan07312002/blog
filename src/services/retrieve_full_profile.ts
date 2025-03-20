import { UUID } from "crypto";
import { UserRole, UserState } from "../models";
import {
    UserPersistenceRepository,
    UserProfilePhotoFilePersistenceRepository,
} from "./interfaces";

export class FullUserProfile {
    constructor(
        // user part
        public uuid: UUID,
        public username: string,
        public email: string,
        public userRole: UserRole[],
        public state: UserState,

        // profile part
        public title?: string,
        public bio?: string,
        public photo_url?: string,
        public lives_in?: string,
        public works_at?: string,
        public studie_at?: string,
    ) {}
}

export class RetrieveFullUserProfile {
    constructor(
        public UserPersistenceRepository: UserPersistenceRepository,
        public userProfilePhotoFilePersistenceRepository: UserProfilePhotoFilePersistenceRepository,
    ) {}

    async execute(userUuid: UUID) {
        const user =
            await this.UserPersistenceRepository.findFullUserByUUID(userUuid);

        if (user.photo_url)
            try {
                user.photo_url =
                    await this.userProfilePhotoFilePersistenceRepository.getRealUrl(
                        user.photo_url,
                    );
            } catch {
                // TODO: what should be done here?
            }

        return user;
    }
}
