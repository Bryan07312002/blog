import { PostgresConfig } from "./persistence/database/config";
import { KyselyDatabaseConnection } from "./persistence/database/connection";
import { FastifyServer } from "./server/fastify_server";
import { RegisterController } from "./controllers/register";
import {
    ServiceFactory,
    ValidatorFactory,
    RepositoryFactory,
    UUIDGeneratorFactory,
} from "./controllers/services_factory";

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

        const repositoryFactory = new RepositoryFactory(db, { salt: 10 });
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
            new RegisterController(this.serviceFactory).handler,
        );
    }

    run() {
        this.server.listen(3000, () => {
            console.log("App running at: " + 3000);
        });
    }
}
