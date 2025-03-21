import { ServerResponse } from "http";
import { Register } from "../services";
import { Controller } from ".";
import { ApiRequest } from "../server";

export interface RegisterFactory {
    createRegisterService(): Register;
}

export interface RequestValidator {
    validate(body: unknown): void;
}

export class RegisterController implements Controller {
    constructor(public registerFactory: RegisterFactory) {}

    async handler(req: ApiRequest, res: ServerResponse) {
        if (!req.body) return res.end();

        console.log(await req.json());

        return res.end();
    }
}
