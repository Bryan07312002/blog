import fastify, {
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
    HookHandlerDoneFunction,
} from "fastify";

import { ApiRequest, Handler, Middleware, Server } from ".";
import { ApiError } from "../error";
export type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export class FastifyServer implements Server {
    server: FastifyInstance;

    constructor() {
        this.server = fastify();

        // this is needed to overwrite fastify json parser so
        // we can get the buffer in handler to transform to Request object
        this.server.addContentTypeParser(
            "application/json",
            { parseAs: "buffer" },
            (_, body, done) => {
                done(null, body);
            },
        );

        // TODO: should add logging here for unknown error
        // TODO: change this to another function
        this.server.setErrorHandler((error, _, reply) => {
            if (error instanceof ApiError)
                return reply.status(error.statusCode).send({
                    error: error.error,
                    message: error.message,
                    details: error.details,
                });

            // Customize the error response
            reply.status(500).send({
                error: "Internal Server Error",
            });
        });
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
        this.server.listen({ port, host: "0.0.0.0" }, callback);
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
                return handler(
                    this.fastifyRequestToApiRequest(request),
                    reply.raw,
                );
            },
        });
    }

    private fastifyRequestToApiRequest(
        fastifyRequest: FastifyRequest,
    ): ApiRequest {
        const headers = new Headers();
        for (const [key, value] of Object.entries(fastifyRequest.headers)) {
            if (Array.isArray(value)) {
                value.forEach((v) => headers.append(key, v));
            } else if (value !== undefined) {
                headers.set(key, value as any);
            }
        }

        const body: unknown =
            fastifyRequest.method !== "GET" && fastifyRequest.method !== "HEAD"
                ? fastifyRequest.body
                : null;

        // FIXME: create the real url
        return new ApiRequest(
            new URL(`http://localhost/${fastifyRequest.url}`),
            {
                method: fastifyRequest.method,
                headers: headers,
                body: body as Buffer,
            },
        );
    }
}
