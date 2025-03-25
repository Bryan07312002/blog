import { ServerResponse } from "http";
import { Controller } from ".";
import { ApiRequest } from "../server";
import { CreatePost, CreatePostDto } from "../services";

export interface CreatePostFactory {
    createCreatePost(): CreatePost;
}

export class CreatePostController extends Controller {
    constructor(private factory: CreatePostFactory) {
        super();
    }

    async handler(req: ApiRequest, __: ServerResponse): Promise<void> {
        const file = await req.file();
        const service = this.factory.createCreatePost();

        await service.execute(
            new CreatePostDto("fake title", req.authUser(), file),
        );
    }
}
