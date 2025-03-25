import { DecodeToken } from "../../services";
import { ApiRequest } from "../../server";
import { ServerResponse } from "http";
import { Middleware } from ".";

export interface DecodeTokenFactory {
    createDecodeToken(): DecodeToken;
}

export class DecodeJwtTokenMiddleware extends Middleware {
    constructor(public factory: DecodeTokenFactory) {
        super();
    }

    handler(req: ApiRequest, _: ServerResponse, next: () => void) {
        const token = req.headers.get("Authorization");
        const service = this.factory.createDecodeToken();
        const payload = service.execute(token?.replace("Bearer ", "") ?? "");

        req.setAuthenticatedUser(payload.uuid);

        next();
    }
}
