import { unauthorizedError, validationError } from "../error";
import { FastifyRequest } from "fastify";
import { ServerResponse } from "http";
import { UUID } from "crypto";

export type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

// this is really ugly for now, need to find a way to make
// this easier to implement
export class ApiRequest extends Request {
    // TODO: this is needed so we can pass data between middlerwares and requests
    // not ideal should be changed in the future
    private rawFastify: FastifyRequest;

    params: unknown;
    query: unknown;

    constructor(req: Request, fastify: FastifyRequest) {
        super(req);

        this.params = fastify.params;
        this.query = fastify.query;
        this.rawFastify = fastify;
    }

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

    files() {
        return this.rawFastify.files();
    }

    async file(): Promise<File> {
        const file = await this.rawFastify.file();
        if (!file)
            throw validationError("expected photo image", [
                { field: "photo", message: "required" },
            ]);

        const buffer = await file.toBuffer(); // Get file as Buffer

        // Convert to a File-like object
        return new File([buffer], file.filename, {
            type: file.mimetype,
            lastModified: Date.now(),
        });
    }

    setAuthenticatedUser(uuid: UUID) {
        (this.rawFastify as any).userUuid = uuid;
    }

    authUser(): UUID {
        if (!(this.rawFastify as any).userUuid) throw unauthorizedError();

        return (this.rawFastify as any).userUuid;
    }
}

export type Handler = (req: ApiRequest, res: ServerResponse) => void;

export type Middleware = (
    req: ApiRequest,
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
