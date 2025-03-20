import { UUID } from "crypto";

export class Post {
    constructor(
        public uuid: UUID,
        public title: string,
        public user_id: UUID,
        public posted_at: Date,
        public file_url: string,
    ) {}
}
