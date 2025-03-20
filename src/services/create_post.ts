import { UUID } from "crypto";
import { Post } from "../models/post";
import {
    CanCreatePostPolicies,
    CreatePostDtoValidator,
    PostFilePersistenceRepository,
    PostPersistenceRepository,
    UserPersistenceRepository,
    UUIDGenerator,
} from ".";

export class CreatePostDto {
    constructor(
        public title: string,
        public user_id: UUID,
        public file: Blob,
    ) {}
}

export class CreatePost {
    constructor(
        private readonly postPersistenceRepository: PostPersistenceRepository,
        private readonly postFilePersistenceRepository: PostFilePersistenceRepository,
        private readonly userPersistenceRepository: UserPersistenceRepository,
        private readonly createPostDtoValidator: CreatePostDtoValidator,
        private readonly canCreatePostPolicies: CanCreatePostPolicies,
        private readonly uuidGenerator: UUIDGenerator,
    ) {}

    async execute(dto: CreatePostDto): Promise<Post> {
        await this.createPostDtoValidator.validate(dto);
        const user = await this.userPersistenceRepository.findByUUID(
            dto.user_id,
        );
        this.canCreatePostPolicies.check(user);

        const uuid = this.uuidGenerator.generate();
        const post = new Post(
            uuid,
            dto.title,
            dto.user_id,
            new Date(),
            uuid + "_" + dto.title,
        );

        await this.postPersistenceRepository.create(post);

        try {
            await this.postFilePersistenceRepository.save(
                post.file_url,
                dto.file,
            );
        } catch (e) {
            await this.postPersistenceRepository.delete(post.uuid);
            throw e;
        }

        post.file_url = await this.postFilePersistenceRepository.getRealUrl(
            post.file_url,
        );

        return post;
    }
}
