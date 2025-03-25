import { ServerResponse } from "http";
import { Controller } from ".";
import { ApiRequest } from "../server";
import { UpdateProfilePhoto, UpdateProfilePhotoDto } from "../services";

export interface UpdateProfilePhotoFactory {
    createUpdateProfilePhoto(): UpdateProfilePhoto;
}

export class UpdateProfilePhotoController extends Controller {
    constructor(private readonly serviceFactory: UpdateProfilePhotoFactory) {
        super();
    }

    async handler(req: ApiRequest, res: ServerResponse): Promise<void> {
        const img = await req.file();
        const userUuid = req.authUser();

        const dto = new UpdateProfilePhotoDto(userUuid, img);
        const service = this.serviceFactory.createUpdateProfilePhoto();

        const url = await service.execute(dto);

        res.writeHead(200, { "content-type": "application/json" });
        res.end(url);
    }
}
