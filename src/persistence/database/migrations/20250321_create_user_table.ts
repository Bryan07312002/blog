import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    db.schema
        .createType("role")
        .asEnum(["reader", "writer", "admin"])
        .execute();

    db.schema
        .createTable("users")
        .addColumn("uuid", "uuid", (col) => col.primaryKey())
        .addColumn("username", "varchar(255)", (col) => col.notNull().unique())
        .addColumn("email", "varchar(255)", (col) => col.notNull().unique())
        .addColumn("password", "varchar(255)", (col) => col.notNull())
        .addColumn("state", "varchar(100)", (col) => col.notNull())
        .execute();

    db.schema
        .createTable("user_roles")
        .addColumn("user_uuid", "uuid", (col) =>
            col.references("users.uuid").notNull().onDelete("cascade"),
        )
        .addColumn("role", sql`role`, (col) => col.notNull())
        .addUniqueConstraint("user_role_unique", ["role", "user_uuid"])
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    db.schema.dropTable("users");
    db.schema.dropType("role");
}
