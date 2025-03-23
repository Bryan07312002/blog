import { KyselyDatabaseConnection } from "../connection";
import { notFoundError } from "../../../error";
import { User } from "../../../models";
import { UUID } from "crypto";
import {
    FullUserProfileDto,
    UserPersistenceRepository,
} from "../../../services";

export class KyselyUserPersistenceRepository
    implements UserPersistenceRepository
{
    constructor(private readonly conn: KyselyDatabaseConnection) {}

    async create(user: User): Promise<void> {
        await this.conn
            .insertInto("users")
            .values({
                uuid: user.uuid,
                email: user.email,
                username: user.username,
                role: user.role,
                state: user.state,
                password: user.password,
            })
            .execute();
    }

    async findByUsernameOrEmail(usernameOrEmail: string): Promise<User> {
        const res = await this.conn
            .selectFrom("users")
            .selectAll()
            .where((eb) =>
                eb.or([
                    eb("email", "=", usernameOrEmail),
                    eb("username", "=", usernameOrEmail),
                ]),
            )
            .executeTakeFirst();

        if (!res)
            throw notFoundError(
                `user with email or username ${usernameOrEmail} not found`,
            );

        return new User(
            res.uuid,
            res.username,
            res.email,
            res.password,
            res.role,
            res.state,
        );
    }

    async findByUUID(uuid: UUID): Promise<User> {
        const res = await this.conn
            .selectFrom("users")
            .selectAll()
            .where("uuid", "=", uuid)
            .executeTakeFirst();

        if (!res)
            throw notFoundError(
                `user with email or username ${uuid} not found`,
            );

        return new User(
            res.uuid,
            res.username,
            res.email,
            res.password,
            res.role,
            res.state,
        );
    }

    async findFullUserByUUID(uuid: UUID): Promise<FullUserProfileDto> {
        const res = await this.conn
            .selectFrom("users")
            .innerJoin("profiles", "profiles.user_uuid", "users.uuid")
            .selectAll()
            .where("uuid", "=", uuid)
            .executeTakeFirst();

        if (!res)
            throw notFoundError(
                `user with email or username ${uuid} not found`,
            );

        return new FullUserProfileDto(res);
    }
}
