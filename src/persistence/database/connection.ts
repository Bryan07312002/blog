import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { PostgresConfig } from "./config";
import { Database } from "./types";

export class KyselyDatabaseConnection extends Kysely<Database> {
    constructor(conf: PostgresConfig) {
        super({
            dialect: new PostgresDialect({
                pool: new Pool({
                    host: conf.host,
                    port: conf.port,
                    user: conf.user,
                    password: conf.password,
                    database: conf.database,
                }),
            }),
        });
    }
}
