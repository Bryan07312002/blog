export * from "./register";

import { ServerResponse } from "http";
import { ApiRequest } from "../server";

export interface RequestValidator<T> {
    validate(body: unknown): T;
}

export abstract class Controller {
    constructor() {
        this.handler = this.handler.bind(this);
    }

    async handler(_: ApiRequest, __: ServerResponse) {
        throw "handler not implemented";
    }
}
