import { ServerResponse } from "http";
import { Login, LoginDto } from "../services";
import { Controller, RequestValidator } from ".";
import { ApiRequest } from "../server";

export interface LoginFactory {
    createLoginService(): Login;
}

export class LoginRequestDto {
    constructor(
        public username_or_email: string,
        public password: string,
    ) {}
}

export class LoginController implements Controller {
    constructor(
        public loginFactory: LoginFactory,
        public requestValidator: RequestValidator<LoginRequestDto>,
    ) {
        this.handler = this.handler.bind(this);
    }

    async handler(req: ApiRequest, res: ServerResponse) {
        const dto = this.requestValidator.validate(await req?.json());

        const service = this.loginFactory.createLoginService();
        const user = await service.execute(
            new LoginDto(dto.username_or_email, dto.password),
        );

        res.writeHead(201, { "content-type": "application-json" });
        res.end(JSON.stringify(user));
    }
}
