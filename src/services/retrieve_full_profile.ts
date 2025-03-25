import { UUID } from "crypto";
import { Role, State } from "../models";
import {
    UserPersistenceRepository,
    ProfilePhotoFilePersistenceRepository,
} from "./interfaces";

export class FullUserProfileDto {
    uuid: UUID;
    username: string;
    email: string;
    role: Role[];
    state: State;

    // profile part
    title?: string;
    bio?: string;
    photo_url?: string;
    lives_in?: string;
    works_at?: string;
    studie_at?: string;

    constructor(params: {
        // user part
        uuid: UUID;
        username: string;
        email: string;
        role: Role[];
        state: State;

        // profile part
        title?: string;
        bio?: string;
        photo_url?: string;
        lives_in?: string;
        works_at?: string;
        studie_at?: string;
    }) {
        this.uuid = params.uuid;
        this.username = params.username;
        this.email = params.email;
        this.role = params.role;
        this.state = params.state;
        this.title = params.title;
        this.bio = params.bio;
        this.photo_url = params.photo_url;
        this.lives_in = params.lives_in;
        this.works_at = params.works_at;
        this.studie_at = params.studie_at;
    }
}

export class RetrieveFullUserProfile {
    constructor(
        public UserPersistenceRepository: UserPersistenceRepository,
        public profilePhotoFilePersistenceRepository: ProfilePhotoFilePersistenceRepository,
    ) {}

    async execute(userUuid: UUID): Promise<FullUserProfileDto> {
        const user =
            await this.UserPersistenceRepository.findFullUserByUUID(userUuid);

        if (user.photo_url)
            try {
                user.photo_url =
                    await this.profilePhotoFilePersistenceRepository.getRealUrl(
                        user.photo_url,
                    );
            } catch {
                // TODO: what should be done here?
            }

        return user;
    }
}
