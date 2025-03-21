import { promises as fs } from "fs";
import * as path from "path";
import { Migrator, FileMigrationProvider } from "kysely";
import { PostgresConfig } from "./config";
import { KyselyDatabaseConnection } from "./connection";
import dotenv from "dotenv";

export async function migrate(db: KyselyDatabaseConnection) {
    const migrator = new Migrator({
        db: db as any,
        provider: new FileMigrationProvider({
            fs,
            path,
            migrationFolder: path.join(__dirname, "./migrations"),
        }),
    });

    const { error, results } = await migrator.migrateToLatest();

    results?.forEach((it) => {
        if (it.status === "Success") {
            console.log(
                `migration "${it.migrationName}" was executed successfully`,
            );
        } else if (it.status === "Error") {
            console.error(`failed to execute migration "${it.migrationName}"`);
        }
    });

    if (error) {
        console.error("failed to migrate");
        console.error(error);
        process.exit(1);
    }

    await db.destroy();
}

if (require.main === module) {
    // initialize .env
    dotenv.config();

    const config = new PostgresConfig();
    const conn = new KyselyDatabaseConnection(config);

    migrate(conn).catch((e) => console.error(e));
}
