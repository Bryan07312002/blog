import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable("profiles")
        .addColumn("user_uuid", "uuid", (col) =>
            col.references("users.uuid").notNull().onDelete("cascade"),
        )
        .addColumn("title", "varchar(100)")
        .addColumn("bio", "varchar(255)")
        .addColumn("profile_photo_url", "varchar(255)")
        .addColumn("lives_in", "varchar(255)")
        .addColumn("works_at", "varchar(255)")
        .addColumn("studie_at", "varchar(255)")
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("profiles").execute();
}
