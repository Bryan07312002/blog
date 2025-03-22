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
    ) {
        this.handler = this.handler.bind(this);
    }

    async handler(req: ApiRequest, res: ServerResponse) {
        const dto = this.requestValidator.validate(await req?.json());

        const service = this.registerFactory.createRegisterService();
        const user = await service.execute(dto);

        res.writeHead(201, { "content-type": "application-json" });
        res.end(JSON.stringify(user));
    }
}
