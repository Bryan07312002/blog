import { IncomingMessage, ServerResponse } from "http";
import { validationError } from "../error";

export class ApiRequest extends Request {
    async string(): Promise<string> {
        if (!this.body) {
            throw "body is null";
        }

        const reader = this.body.getReader();
        let result = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // Convert Uint8Array to string
            result += new TextDecoder().decode(value);
        }

        return result;
    }

    async json(): Promise<unknown> {
        if (this.headers.get("content-type") != "application/json")
            throw validationError("expected request to be json");

        const jsonString = await this.string();
        return JSON.parse(jsonString);
    }
}

export type Handler = (req: ApiRequest, res: ServerResponse) => void;

export type Middleware = (
    req: IncomingMessage,
    res: ServerResponse,
    next: () => void,
) => void;

export interface Server {
    get(path: string, middleware: Middleware[], handler: Handler): void;
    post(path: string, middleware: Middleware[], handler: Handler): void;
    patch(path: string, middlewares: Middleware[], handler: Handler): void;
    put(path: string, middleware: Middleware[], handler: Handler): void;
    delete(path: string, middleware: Middleware[], handler: Handler): void;
    use(middleware: Middleware): void;
    listen(port: number, callback: () => void): void;
}
