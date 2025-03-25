import { ServerResponse } from "http";
import { Controller } from ".";
import { ApiRequest } from "../server";
import { UpdateProfilePhoto, UpdateProfilePhotoDto } from "../services";
import { validationError } from "../error";

export interface UpdateProfilePhotoFactory {
    createUpdateProfilePhoto(): UpdateProfilePhoto;
}

export class UpdateProfilePhotoController extends Controller {
    constructor(private readonly serviceFactory: UpdateProfilePhotoFactory) {
        super();
    }

    async handler(req: ApiRequest, res: ServerResponse): Promise<void> {
        const img = await req.file();
        if (!img)
            throw validationError("expected photo image", [
                { field: "photo", message: "required" },
            ]);

        const blob = new Blob([await img.toBuffer()]);
        const service = this.serviceFactory.createUpdateProfilePhoto();

        const userUuid = req.authUser();
        const dto = new UpdateProfilePhotoDto(
            userUuid,
            // TODO: quick fix should prepare File Objecet validation later
            new File([blob], userUuid + img.mimetype.split("/")[1], {
                type: img.mimetype.split("/")[1],
            }),
        );
        const url = await service.execute(dto);

        res.writeHead(200, { "content-type": "application/json" });
        res.end(url);
    }
}
