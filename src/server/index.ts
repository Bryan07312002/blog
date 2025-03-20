import { IncomingMessage, ServerResponse } from "http";

export type Handler = (req: IncomingMessage, res: ServerResponse) => void;

export type Middleware = (
    req: IncomingMessage,
    res: ServerResponse,
    next: () => void,
) => void;

export interface Server {
    get(path: string, middleware: Middleware[], handler: Handler): void;
    post(path: string, middleware: Middleware[], handler: Handler): void;
    put(path: string, middleware: Middleware[], handler: Handler): void;
    delete(path: string, middleware: Middleware[], handler: Handler): void;
    use(middleware: Middleware): void;
    listen(port: number, callback: () => void): void;
}
