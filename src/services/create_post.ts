import { UUID } from "crypto";
import {
    CanCreatePostPolicies,
    CreatePostDtoValidator,
    DecompressionStrategy,
    PostFilePersistenceRepository,
    PostPersistenceRepository,
    UserPersistenceRepository,
    MarkdownToHtmlStrategy,
    UUIDGenerator,
} from ".";
import { validationError } from "../error";
import { writeFileSync } from "fs";

export class CreatePostDto {
    constructor(
        public title: string,
        public user_id: UUID,
        public file: File, // zip file
    ) {}
}

const validFileTypes = new Set(["gif", "jpg", "png"]);

export class CreatePost {
    constructor(
        private readonly postPersistenceRepository: PostPersistenceRepository,
        private readonly postFilePersistenceRepository: PostFilePersistenceRepository,
        private readonly userPersistenceRepository: UserPersistenceRepository,
        private readonly createPostDtoValidator: CreatePostDtoValidator,
        private readonly canCreatePostPolicies: CanCreatePostPolicies,
        private readonly decompressionStrategy: DecompressionStrategy,
        private readonly markdownToHtmlStrategy: MarkdownToHtmlStrategy,
        private readonly uuidGenerator: UUIDGenerator,
    ) {}

    async execute(dto: CreatePostDto): Promise<void> {
        const files = await this.decompressionStrategy.decompress(dto.file);
        const { md: markdownFile, resources } = this.findAndPrepare(files);

        const data = await markdownFile.text();
        const html = this.markdownToHtmlStrategy.convert(data);
        writeFileSync("html.html", html);
        console.log(html);
    }

    private findAndPrepare(files: File[]): { md: File; resources: File[] } {
        let mainMd;
        const resources = [];
        for (const file of files) {
            if (file.type == "md") {
                if (mainMd)
                    throw validationError(
                        "should only contain one markdown file",
                    );

                mainMd = file;
                continue;
            }

            if (!validFileTypes.has(file.type))
                throw validationError(
                    `invalid file type, type: ${file.type} not supported`,
                );

            resources.push(file);
        }

        if (!mainMd)
            throw validationError(`Should contain at least one Markdown file`);

        return {
            md: mainMd,
            resources,
        };
    }
}
