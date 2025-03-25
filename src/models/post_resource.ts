import { UUID } from "crypto";

export class PostResource {
    constructor(
        public post_uuid: UUID,
        public name: string,
        public file_url: string,
    ) {}
}
