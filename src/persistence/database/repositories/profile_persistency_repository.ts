import { UserProfilePersistenceRepository } from "../../../services";
import { KyselyDatabaseConnection } from "../connection";
import { notFoundError } from "../../../error";
import { UserProfile } from "../../../models";
import { UUID } from "crypto";

export class KyselyProfilePersistecyRepository
    implements UserProfilePersistenceRepository
{
    constructor(public readonly conn: KyselyDatabaseConnection) {}

    async create(userUuid: UUID): Promise<void> {
        await this.conn
            .insertInto("profiles")
            .values({ user_uuid: userUuid })
            .execute();
    }

    async update(profile: UserProfile): Promise<void> {
        await this.conn
            .updateTable("profiles")
            .set({
                title: profile.title,
                bio: profile.bio,
                profile_photo_url: profile.profilePhotoUrl,
                lives_in: profile.livesIn,
                works_at: profile.worksAt,
                studie_at: profile.studieAt,
            })
            .where("user_uuid", "=", profile.userUuid)
            .execute();
    }

    async findByUserUUID(userUuid: UUID): Promise<UserProfile> {
        const profile = await this.conn
            .selectFrom("profiles")
            .selectAll()
            .where("user_uuid", "=", userUuid)
            .executeTakeFirst();

        if (!profile) throw notFoundError("user profile not found");

        return new UserProfile(
            profile.user_uuid,
            profile.title,
            profile.bio,
            profile.profile_photo_url,
            profile.lives_in,
            profile.works_at,
            profile.studie_at,
        );
    }
}
