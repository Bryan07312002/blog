import { ApiRequest } from "../../server";
import { ServerResponse } from "http";

export class Middleware {
    constructor() {
        this.handler = this.handler.bind(this);
    }

    handler(_: ApiRequest, __: ServerResponse, ___: () => void): void {
        throw new Error("not implemented yet");
    }
}

export * from "./authentication";
