import { EnvReader } from "../../config";

export class PostgresConfig extends EnvReader {
    readonly host: string;
    readonly port: number;
    readonly user: string;
    readonly password: string;
    readonly database: string;

    constructor() {
        super();

        this.host = this.getRequiredEnvVariable("PG_HOST");
        this.port = parseInt(this.getRequiredEnvVariable("PG_PORT"), 10);
        this.user = this.getRequiredEnvVariable("PG_USER");
        this.password = this.getRequiredEnvVariable("PG_PASSWORD");
        this.database = this.getRequiredEnvVariable("PG_DATABASE");
    }
}
