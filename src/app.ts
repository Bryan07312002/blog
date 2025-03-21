import { PostgresConfig } from "./persistence/database/config";
import { KyselyDatabaseConnection } from "./persistence/database/connection";
import { FastifyServer } from "./server/fastify_server";

export class App {
    constructor(
        public readonly databaseConnection: KyselyDatabaseConnection,
        public readonly server: FastifyServer,
    ) {}

    static initialize(): App {
        const postgresConfig = new PostgresConfig();
        const db = new KyselyDatabaseConnection(postgresConfig);

        const server = new FastifyServer();
        const app = new App(db, server);
        app.registerRoutes();

        return app;
    }

    registerRoutes() {
        this.server.get("/health", [], (_, res) => {
            res.writeHead(200, { "content-type": "text/html" });
            res.end(JSON.stringify({ status: "Ok" }));
        });
    }

    run() {
        this.server.listen(3000, () => {
            console.log("App running at: " + 3000);
        });
    }
}
