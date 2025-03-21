export * from "./register";
import { Handler } from "../server";

export interface RequestValidator<T> {
    validate(body: unknown): T;
}

export interface Controller {
    handler: Handler;
}
