import { UUID } from "crypto";

export class UserProfile {
    constructor(
        public userUuid: UUID,
        public title?: string,
        public bio?: string,
        public profile_photo_url?: string,
        // just general localization or place name
        public lives_in?: string,
        public works_at?: string,
        public studie_at?: string,
    ) {}
}
