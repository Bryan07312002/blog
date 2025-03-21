import { ServerResponse } from "http";
import { Register, RegisterDto } from "../services";
import { Controller, RequestValidator } from ".";
import { ApiRequest } from "../server";

export interface RegisterFactory {
    createRegisterService(): Register;
}

export class RegisterController implements Controller {
    constructor(
        public registerFactory: RegisterFactory,
        public requestValidator: RequestValidator<RegisterDto>,
    ) {}

    async handler(req: ApiRequest, res: ServerResponse) {
        if (!req.body) return res.end();
        const body = await req.json();

        const dto = this.requestValidator.validate(body);

        const service = this.registerFactory.createRegisterService();
        const user = await service.execute(dto);

        res.writeHead(201, { "content-type": "application-json" });
        return res.end(JSON.stringify(user));
    }
}
