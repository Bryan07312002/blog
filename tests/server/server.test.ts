import fastify, {
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
} from "fastify";
import { Handler, Middleware } from "../../src/server";
import { FastifyServer } from "../../src/server/fastify_server";
import { jest } from "@jest/globals";

jest.mock("fastify", () => {
    const mockInstance = {
        route: jest.fn(),
        addHook: jest.fn(),
        addContentTypeParser: jest.fn(),
        setErrorHandler: jest.fn(),
        listen: jest.fn((_: { port: number }, callback: () => void) =>
            callback(),
        ),
    };
    return jest.fn(() => mockInstance);
});

const mockedFastify = fastify as jest.MockedFunction<typeof fastify>;
const mockFastifyInstance = fastify() as any as jest.Mocked<FastifyInstance>;
describe("FastifyServer", () => {
    let fastifyServer: FastifyServer;

    beforeEach(() => {
        jest.clearAllMocks();
        fastifyServer = new FastifyServer();
    });

    test("should initialize a Fastify instance", () => {
        expect(mockedFastify).toHaveBeenCalled();
        expect(fastifyServer.server).toBe(mockFastifyInstance);
    });

    describe("HTTP methods", () => {
        const methods = [
            { method: "get", httpMethod: "GET" },
            { method: "post", httpMethod: "POST" },
            { method: "patch", httpMethod: "PATCH" },
            { method: "put", httpMethod: "PUT" },
            { method: "delete", httpMethod: "DELETE" },
        ];

        methods.forEach(({ method, httpMethod }) => {
            test(`should register a ${httpMethod} route`, () => {
                const path = "/test";
                const middlewares: Middleware[] = [jest.fn(), jest.fn()];
                const handler: Handler = jest.fn();

                (fastifyServer as any)[method](path, middlewares, handler);

                expect(mockFastifyInstance.route).toHaveBeenCalledWith({
                    url: path,
                    method: httpMethod,
                    preHandler: expect.any(Array),
                    handler: expect.any(Function),
                });

                const routeConfig = mockFastifyInstance.route.mock.calls[0][0];
                expect(routeConfig.preHandler).toHaveLength(middlewares.length);
            });
        });
    });

    describe("registerRoute", () => {
        test("should convert middlewares and handler correctly", () => {
            const path = "/test";
            const method = "GET";
            const middlewares: Middleware[] = [
                //@ts-ignore
                jest.fn((_, __, next) => next()),
                //@ts-ignore
                jest.fn((_, __, next) => next()),
            ];
            const handler: Handler = jest.fn();

            (fastifyServer as any).registerRoute(
                path,
                method,
                middlewares,
                handler,
            );

            const routeConfig = mockFastifyInstance.route.mock.calls[0][0];

            // Test middleware conversion
            // @ts-ignore
            routeConfig.preHandler?.forEach(
                (convertedMiddleware: any, index: any) => {
                    const mockRequest = { headers: {} } as FastifyRequest;
                    const mockReply = { raw: {} } as FastifyReply;
                    const mockDone = jest.fn();

                    convertedMiddleware(mockRequest, mockReply, mockDone);
                    expect(middlewares[index]).toHaveBeenCalledWith(
                        mockRequest.raw,
                        mockReply.raw,
                        mockDone,
                    );
                },
            );

            // Test handler conversion
            const mockRequest = { headers: {} } as FastifyRequest;
            const mockReply = { raw: {} } as FastifyReply;
            //@ts-ignore
            routeConfig.handler(mockRequest, mockReply);
        });
    });

    test("use should add middleware as onRequest hook", () => {
        const middleware: Middleware = jest.fn();
        fastifyServer.use(middleware);

        expect(mockFastifyInstance.addHook).toHaveBeenCalledWith(
            "onRequest",
            expect.any(Function),
        );

        const convertedMiddleware =
            mockFastifyInstance.addHook.mock.calls[0][1];
        const mockRequest = { raw: {} } as FastifyRequest;
        const mockReply = { raw: {} } as FastifyReply;
        const mockNext = jest.fn();

        //@ts-ignore
        convertedMiddleware(mockRequest, mockReply, mockNext);

        expect(middleware).toHaveBeenCalledWith(
            mockRequest.raw,
            mockReply.raw,
            mockNext,
        );
    });

    test("listen should start server on specified port", () => {
        const port = 3000;
        const callback = jest.fn();

        fastifyServer.listen(port, callback);

        expect(mockFastifyInstance.listen).toHaveBeenCalledWith(
            { port, host: "0.0.0.0" },
            callback,
        );
        expect(callback).toHaveBeenCalled();
    });
});
