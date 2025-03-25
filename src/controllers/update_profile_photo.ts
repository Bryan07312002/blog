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

        const dto = new UpdateProfilePhotoDto(
            req.authUser(),
            new File([blob], "", { type: img.type }),
        );
        const url = await service.execute(dto);

        res.writeHead(200, { "content-type": "application/json" });
        res.end(url);
    }
}
