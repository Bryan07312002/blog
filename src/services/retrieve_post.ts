import { UUID } from "crypto";
import { PostFilePersistenceRepository, PostPersistenceRepository } from ".";
import { Post } from "../models";

export class RetrievePost {
    constructor(
        private readonly postPersistenceRepository: PostPersistenceRepository,
        private readonly postFilePersistenceRepository: PostFilePersistenceRepository,
    ) {}

    async execute(uuid: UUID): Promise<Post> {
        const post = await this.postPersistenceRepository.findByUUID(uuid);
        post.file_url = await this.postFilePersistenceRepository.getRealUrl(
            post.file_url,
        );

        return post;
    }
}
