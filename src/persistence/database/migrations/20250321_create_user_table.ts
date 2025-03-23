import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    db.schema.createType("role").asEnum(["reader", "writer", "admin"]);

    db.schema
        .createTable("users")
        .addColumn("uuid", "uuid", (col) => col.primaryKey())
        .addColumn("username", "varchar(255)", (col) => col.notNull().unique())
        .addColumn("email", "varchar(255)", (col) => col.notNull().unique())
        .addColumn("password", "varchar(255)", (col) => col.notNull())
        .addColumn("role", sql`role`, (col) => col.notNull())
        .addColumn("state", "varchar(100)", (col) => col.notNull());
}

export async function down(db: Kysely<any>): Promise<void> {
    db.schema.dropTable("users");
    db.schema.dropType("role");
}
