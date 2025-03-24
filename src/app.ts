import { KyselyDatabaseConnection } from "./persistence/database/connection";
import { DecodeJwtTokenMiddleware } from "./controllers/middlewares";
import { PostgresConfig } from "./persistence/database/config";
import { FastifyServer } from "./server/fastify_server";
import {
    ServiceFactory,
    ValidatorFactory,
    RepositoryFactory,
    UUIDGeneratorFactory,
} from "./controllers/services_factory";
import {
    LoginController,
    RegisterController,
    RetrieveFullUserController,
} from "./controllers";

export class App {
    constructor(
        public readonly databaseConnection: KyselyDatabaseConnection,
        public readonly server: FastifyServer,
        public serviceFactory: ServiceFactory,
    ) {}

    static initialize(): App {
        const postgresConfig = new PostgresConfig();
        const db = new KyselyDatabaseConnection(postgresConfig);

        const server = new FastifyServer();

        const repositoryFactory = new RepositoryFactory(
            db,
            { salt: 10 },
            { expiresIn: "1h", secret: "secret" },
            { baseUrl: new URL("http://localhost/"), basePath: "media" },
        );
        const validatorFactory = new ValidatorFactory();
        const uuiDGeneratorFactory = new UUIDGeneratorFactory();
        const serviceFactory = new ServiceFactory(
            repositoryFactory,
            validatorFactory,
            uuiDGeneratorFactory,
        );

        const app = new App(db, server, serviceFactory);
        app.registerRoutes();

        return app;
    }

    registerRoutes() {
        this.server.get("/health", [], (_, res) => {
            res.writeHead(200, { "content-type": "application/html" });
            res.end(JSON.stringify({ status: "Ok" }));
        });

        this.server.post(
            "/register",
            [],
            new RegisterController(
                this.serviceFactory,
                this.serviceFactory.validatorFactory.createRegisterRequestValidator(),
            ).handler,
        );

        this.server.post(
            "/login",
            [],
            new LoginController(
                this.serviceFactory,
                this.serviceFactory.validatorFactory.createLoginRequestValidator(),
            ).handler,
        );

        this.server.get(
            "/users/:uuid",
            [new DecodeJwtTokenMiddleware(this.serviceFactory).handler],
            new RetrieveFullUserController(
                this.serviceFactory,
                this.serviceFactory.validatorFactory.createUUIDValidator(),
            ).handler,
        );
    }

    run() {
        this.server.listen(3000, () => {
            console.log("App running at: " + 3000);
        });
    }
}
