import { RetrieveFullUserProfile } from "../services";
import { Controller, RequestValidator } from ".";
import { ApiRequest } from "../server";
import { ServerResponse } from "http";
import { UUID } from "crypto";

export interface RetrieveFullUserProfileFactory {
    createRetrieveFullUserProfile(): RetrieveFullUserProfile;
}

export class RetrieveFullUserController extends Controller {
    constructor(
        private factory: RetrieveFullUserProfileFactory,
        private requestValidator: RequestValidator<{ uuid: UUID }>,
    ) {
        super();
    }

    async handler(req: ApiRequest, res: ServerResponse) {
        const { uuid } = this.requestValidator.validate(req.params);

        const service = this.factory.createRetrieveFullUserProfile();
        const user = await service.execute(uuid);

        res.writeHead(200, { "content-type": "application-json" });
        res.end(JSON.stringify(user));
    }
}
