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

export * from "./register";
export * from "./login";
export * from "./retrieve_full_user";
export * from "./update_profile";
export * from "./update_profile_photo";
