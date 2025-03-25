import { UpdateProfile, UpdateProfileDTO } from "../services";
import { Controller, RequestValidator } from ".";
import { ApiRequest } from "../server";
import { ServerResponse } from "http";

export interface UpdateProfileFactory {
    createUpdateProfile(): UpdateProfile;
}

export class UpdateProfileController extends Controller {
    constructor(
        public factory: UpdateProfileFactory,
        public requestValidator: RequestValidator<UpdateProfileDTO>,
    ) {
        super();
    }

    async handler(req: ApiRequest, res: ServerResponse): Promise<void> {
        const dto = this.requestValidator.validate(req.json());

        const service = this.factory.createUpdateProfile();
        await service.execute(req.authUser(), dto);

        res.writeHead(200);
        res.end();
    }
}
