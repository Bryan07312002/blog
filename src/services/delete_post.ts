import { UUID } from "crypto";
import {
    PostFilePersistenceRepository,
    PostPersistenceRepository,
    UserPersistenceRepository,
    CanDeletePostPolicies,
} from ".";

export class DeletePostDto {
    constructor(
        public uuid: UUID,
        public user_id: UUID,
    ) {}
}

export class DeletePost {
    constructor(
        private readonly postPersistenceRepository: PostPersistenceRepository,
        private readonly postFilePersistenceRepository: PostFilePersistenceRepository,
        private readonly userPersistenceRepository: UserPersistenceRepository,
        private readonly canDeletePostPolicies: CanDeletePostPolicies,
    ) {}

    async execute(dto: DeletePostDto): Promise<void> {
        const user = await this.userPersistenceRepository.findByUUID(
            dto.user_id,
        );
        const post = await this.postPersistenceRepository.findByUUID(dto.uuid);
        this.canDeletePostPolicies.check(user, post);

        // FIXME: get errors and try again if something goes wrong
        await Promise.all([
            await this.postPersistenceRepository.delete(post.uuid),
            await this.postFilePersistenceRepository.delete(post.file_url),
        ]);
    }
}
