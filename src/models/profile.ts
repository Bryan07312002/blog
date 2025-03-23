import { UUID } from "crypto";

export class UserProfile {
    constructor(
        public userUuid: UUID,
        public title?: string,
        public bio?: string,
        public profilePhotoUrl?: string,
        // just general localization or place name
        public livesIn?: string,
        public worksAt?: string,
        public studieAt?: string,
    ) {}
}
