import fastify, {
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
    HookHandlerDoneFunction,
} from "fastify";
import { Handler, Middleware, Server } from ".";

export type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export class FastifyServer implements Server {
    server: FastifyInstance;

    constructor() {
        this.server = fastify();
    }

    get(path: string, middlewares: Middleware[], handler: Handler): void {
        this.registerRoute(path, "GET", middlewares, handler);
    }

    post(path: string, middlewares: Middleware[], handler: Handler): void {
        this.registerRoute(path, "POST", middlewares, handler);
    }

    patch(path: string, middlewares: Middleware[], handler: Handler): void {
        this.registerRoute(path, "PATCH", middlewares, handler);
    }

    put(path: string, middlewares: Middleware[], handler: Handler): void {
        this.registerRoute(path, "PUT", middlewares, handler);
    }

    delete(path: string, middlewares: Middleware[], handler: Handler): void {
        this.registerRoute(path, "DELETE", middlewares, handler);
    }

    use(middleware: Middleware): void {
        this.server.addHook("onRequest", this.toFastifyMiddleware(middleware));
    }

    listen(port: number, callback: () => void): void {
        this.server.listen({ port }, callback);
    }

    private toFastifyMiddleware(middleware: Middleware) {
        return (
            request: FastifyRequest,
            reply: FastifyReply,
            done: HookHandlerDoneFunction,
        ) => {
            return middleware(request.raw, reply.raw, done);
        };
    }

    private registerRoute(
        path: string,
        method: Method,
        middlewares: Middleware[],
        handler: Handler,
    ) {
        const preHandler: ((
            request: FastifyRequest,
            reply: FastifyReply,
            done: HookHandlerDoneFunction,
        ) => void)[] = middlewares.map(this.toFastifyMiddleware);

        this.server.route({
            url: path,
            method,
            preHandler,
            handler: async (request: FastifyRequest, reply: FastifyReply) => {
                handler(request.raw, reply.raw);
            },
        });
    }
}
